import JSZip from 'jszip';
import * as FileSystem from 'expo-file-system';
import { XMLParser } from 'fast-xml-parser';
import { decode } from 'he';
import { parseDocument } from 'htmlparser2';
import { DomUtils } from 'htmlparser2';

/**
 * Loads an EPUB file from a given URI and returns a JSZip instance.
 * @param {string} fileUri - The URI of the EPUB file.
 * @returns {Promise<JSZip>} A promise that resolves to a JSZip instance.
 */
export async function loadEpubFromUri(fileUri) {
  console.log('Loading EPUB from URI:', fileUri);
  try {
    let epubData;

    if (fileUri.startsWith('content://')) {
      console.log('Content URI detected, copying to local cache');
      // It's a content URI; we need to copy the file to a local cache
      const cacheUri = `${FileSystem.cacheDirectory}temp.epub`;
      await FileSystem.copyAsync({
        from: fileUri,
        to: cacheUri,
      });
      epubData = await FileSystem.readAsStringAsync(cacheUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // Optionally delete the temp file
      await FileSystem.deleteAsync(cacheUri, { idempotent: true });
    } else {
      console.log('File URI or local file detected');
      // It's a file URI or local file
      epubData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    console.log('EPUB data loaded, creating JSZip instance');
    const zip = await JSZip.loadAsync(epubData, { base64: true });
    console.log('JSZip instance created successfully');
    return zip;
  } catch (error) {
    console.error('Error loading EPUB:', error);
    throw error;
  }
}

/**
 * Parses the META-INF/container.xml file to find the rootfile path.
 * @param {JSZip} zip - The JSZip instance of the EPUB.
 * @returns {Promise<string>} The path to the rootfile (e.g., content.opf).
 */
export async function parseContainerXml(zip) {
  console.log('Parsing container.xml');
  const containerXmlText = await zip.file('META-INF/container.xml').async('text');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });
  const containerJson = parser.parse(containerXmlText);

  const rootfilePath = containerJson.container.rootfiles.rootfile['full-path'];
  console.log('Rootfile path found:', rootfilePath);
  return rootfilePath;
}

/**
 * Parses the `content.opf` file to extract metadata, manifest, and spine information.
 * @param {JSZip} zip - The JSZip instance of the EPUB.
 * @param {string} rootfilePath - The path to the `content.opf` file.
 * @returns {Promise<object>} The metadata, manifest items, and spine items.
 */
export async function parseContentOpf(zip, rootfilePath) {
  console.log('Parsing content.opf at path:', rootfilePath);
  const contentOpfText = await zip.file(rootfilePath).async('text');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });
  const contentOpfJson = parser.parse(contentOpfText);

  const metadata = contentOpfJson.package.metadata;
  let manifestItems = contentOpfJson.package.manifest.item;
  let spineItems = contentOpfJson.package.spine.itemref;

  // Ensure manifestItems and spineItems are arrays
  manifestItems = Array.isArray(manifestItems) ? manifestItems : [manifestItems];
  spineItems = Array.isArray(spineItems) ? spineItems : [spineItems];

  console.log('Metadata, manifest, and spine extracted');
  return { metadata, manifestItems, spineItems };
}

/**
 * Extracts the book title from the metadata.
 * @param {object} metadata - The metadata object from `content.opf`.
 * @returns {string} The book title.
 */
export function extractBookTitle(metadata) {
  console.log('Extracting book title from metadata');
  let bookTitle = 'Unknown_Book';

  if (metadata && metadata['dc:title']) {
    bookTitle = metadata['dc:title'];
    if (Array.isArray(bookTitle)) {
      bookTitle = bookTitle[0];
    }
  }

  console.log('Book title extracted:', bookTitle);
  return bookTitle;
}

/**
 * Parses the table of contents from `toc.ncx` or `nav.xhtml`.
 * @param {JSZip} zip - The JSZip instance of the EPUB.
 * @param {Array} manifestItems - The manifest items from `content.opf`.
 * @returns {Promise<Array>} An array of chapter objects.
 */
export async function parseTableOfContents(zip, manifestItems) {
  console.log('Parsing table of contents');
  // Try to find `toc.ncx` or `nav.xhtml` in the manifest
  let tocItem = manifestItems.find(
    (item) =>
      item.id === 'ncx' ||
      item['media-type'] === 'application/x-dtbncx+xml' ||
      (item['media-type'] === 'application/x-dtbncx+xml' && item.href.endsWith('.ncx'))
  );

  if (tocItem) {
    console.log('TOC item found:', tocItem);
    // Parse `toc.ncx`
    const tocPath = tocItem.href;
    const tocText = await zip.file(tocPath).async('text');
    const tocJson = parse(tocText, {
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });

    const navPoints = tocJson.ncx.navMap.navPoint;

    // Ensure navPoints is an array
    const navPointsArray = Array.isArray(navPoints) ? navPoints : [navPoints];

    // Map navPoints to an array of chapters
    const chapters = navPointsArray.map((navPoint) => {
      const navLabel = Array.isArray(navPoint.navLabel)
        ? navPoint.navLabel[0].text
        : navPoint.navLabel.text;

      const contentSrc = navPoint.content['src'] || navPoint.content['@_src'];

      return {
        id: navPoint['id'] || navPoint['@_id'],
        label: navLabel,
        contentSrc: contentSrc,
      };
    });

    console.log('Chapters extracted:', chapters.length);
    return chapters;
  } else {
    console.log('Trying to parse nav.xhtml for EPUB 3');
    // Try to parse `nav.xhtml` for EPUB 3
    tocItem = manifestItems.find(
      (item) =>
        item.properties === 'nav' ||
        (item['media-type'] === 'application/xhtml+xml' && item.href.endsWith('nav.xhtml'))
    );

    if (tocItem) {
      console.log('nav.xhtml found');
      const tocPath = tocItem.href;
      const tocText = await zip.file(tocPath).async('text');
      const tocJson = parse(tocText, {
        ignoreAttributes: false,
        attributeNamePrefix: '',
        htmlNode: true,
      });

      // Extract chapters from the navigation document
      const nav = tocJson.html.body.nav;
      let navItems = [];

      if (Array.isArray(nav)) {
        navItems = nav.find((n) => n['@_epub:type'] === 'toc').ol.li;
      } else {
        navItems = nav.ol.li;
      }

      const chapters = [];

      const parseNavItems = (items, parentLabel = '') => {
        items.forEach((item) => {
          let navLabel = '';
          let contentSrc = '';

          if (item.a) {
            navLabel = item.a['#text'] || (item.a.span ? item.a.span['#text'] : '');
            contentSrc = item.a['href'] || item.a['@_href'];
          } else if (item.span && item.span.a) {
            navLabel = item.span.a['#text'];
            contentSrc = item.span.a['href'] || item.span.a['@_href'];
          }

          const label = parentLabel ? `${parentLabel} - ${navLabel}` : navLabel;

          chapters.push({
            id: contentSrc,
            label: label,
            contentSrc: contentSrc,
          });

          if (item.ol && item.ol.li) {
            const subItems = Array.isArray(item.ol.li) ? item.ol.li : [item.ol.li];
            parseNavItems(subItems, label);
          }
        });
      };

      const navItemsArray = Array.isArray(navItems) ? navItems : [navItems];
      parseNavItems(navItemsArray);

      console.log('Chapters extracted from nav.xhtml:', chapters.length);
      return chapters;
    } else {
      console.error('TOC not found in EPUB manifest');
      throw new Error('TOC not found in EPUB manifest.');
    }
  }
}

/**
 * Processes HTML content by parsing it into a JSON structure.
 * @param {string} htmlContent - The raw HTML content.
 * @returns {object} The parsed HTML content as a JSON object.
 */
export function processHtmlContent(htmlContent) {
  console.log('Processing HTML content');
  // Decode HTML entities
  const decodedContent = decode(htmlContent);

  // Parse the HTML into a DOM structure
  const dom = parseDocument(decodedContent);

  // Find the <body> element
  const body = DomUtils.findOne((elem) => elem.name === 'body', dom.children);

  // Function to recursively traverse DOM nodes and build JSON
  const traverseNodes = (nodes) => {
    return nodes
      .map((node) => {
        if (node.type === 'text') {
          return node.data.trim();
        } else if (node.type === 'tag') {
          const children = node.children ? traverseNodes(node.children) : [];
          return {
            type: node.name,
            props: node.attribs,
            children: children.filter((child) => child !== ''),
          };
        }
        return '';
      })
      .filter((node) => node !== '');
  };

  const content = traverseNodes(body.children);

  console.log('HTML content processed');
  return content;
}