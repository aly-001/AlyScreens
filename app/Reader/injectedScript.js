export const injectedScript = `
  let intervalId = null;

  function wrapNode(node, wordList) {
    if (node.nodeType === Node.TEXT_NODE) {
      let words = node.textContent.split(/(\\s+|--|–|—)/); // Split by whitespace, capturing the spaces
      let newContent = words.map(word => {
        if (word.trim().length > 0) {
          wordCount++;
          const uniqueId = 'word-' + wordCount;
          wordList.push(word);
          return '<span id="' + uniqueId + '">' + word + '</span>';
        }
        return word; // Preserve the spaces as is
      }).join('');

      const tempElement = document.createElement('div');
      tempElement.innerHTML = newContent;
      while (tempElement.firstChild) {
        node.parentNode.insertBefore(tempElement.firstChild, node);
      }
      node.parentNode.removeChild(node);
    } else {
      Array.from(node.childNodes).forEach(child => wrapNode(child, wordList));
    }
  }

  function wrapWordsInSpans() {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      const doc = iframe.contentWindow.document;
      if (!doc.body.classList.contains('words-wrapped')) {
        wordCount = 0;
        let wordList = [];
        wrapNode(doc.body, wordList);
        doc.body.classList.add('words-wrapped');
        doc.body.wordList = wordList;
      }
    }
  }

  function addLongPressListener() {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      const doc = iframe.contentWindow.document;

      if (!doc.body.classList.contains('long-press-listener-added')) {
        doc.body.classList.add('long-press-listener-added');

        let timer;
        doc.body.addEventListener('touchstart', function(event) {
          const targetElement = event.target;
          if (targetElement.tagName === 'SPAN') {
            timer = setTimeout(() => {
              const wordId = parseInt(targetElement.id.replace('word-', ''), 10);
              const word = targetElement.textContent.trim();

              // Get context
              const contextInner = 5;
              const contextOuter = 50;
              const startIndexInner = Math.max(0, wordId - contextInner - 1);
              const endIndexInner = Math.min(doc.body.wordList.length, wordId + contextInner);
              const innerContext = doc.body.wordList.slice(startIndexInner, endIndexInner).join(" ");

              const startIndexOuter = Math.max(0, wordId - contextOuter - 1);
              const endIndexOuter = Math.min(doc.body.wordList.length, wordId + contextOuter);
              const outerContext = doc.body.wordList.slice(startIndexOuter, endIndexOuter).join(" ");
              const entireTextHTML = doc.body.innerHTML;

              // Get location
              const rect = targetElement.getBoundingClientRect();
              const location = {
                top: rect.top,
                left: rect.left % window.innerWidth, // Normalize left position
                width: rect.width,
                height: rect.height
              };

              window.ReactNativeWebView.postMessage(JSON.stringify({ type: "longpress", text: targetElement.outerHTML, innerContext: innerContext, outerContext: outerContext, word: word, location: location, entireTextHTML: entireTextHTML}));
            }, 200); // 200ms for long press duration
          }
        });

        doc.body.addEventListener('touchend', function() {
          clearTimeout(timer); // Clear the timer if touch ends before 300ms
        });

        doc.body.addEventListener('touchmove', function() {
          clearTimeout(timer); // Clear the timer if the user moves their finger
        });
      }
    }
  }

  function applyCustomStyles() {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      const doc = iframe.contentWindow.document;
      var style = document.createElement('style');
      style.innerHTML = \`
        body {
          font-family: 'System', Helvetica, !important;
          font-size: 18pt !important;
          font-weight: 500 !important;
          line-height: 1.6 !important;
          color: "#ffffff" !important;
        }
      \`;
      doc.head.appendChild(style);
    }
  }


  function runFunctionsForOneMinute() {
      
    // window.ReactNativeWebView.postMessage(JSON.stringify({ type: "rerunning functions for 10s"}));

    // Clear any existing interval
    if (intervalId !== null) {
      clearInterval(intervalId);
      // window.ReactNativeWebView.postMessage(JSON.stringify({ type: "existing interval cleared"}));
    }

    // Set up a new interval
    // window.ReactNativeWebView.postMessage(JSON.stringify({ type: "calling functions every 10ms"}));
 
    intervalId = setInterval(() => {
      
      applyCustomStyles();
      wrapWordsInSpans();
      addLongPressListener();
      // window.ReactNativeWebView.postMessage(JSON.stringify({ type: "...functions called"}));
    }, 100);

    // Stop the interval after one minute
    setTimeout(() => {
      clearInterval(intervalId);
      intervalId = null;
      // window.ReactNativeWebView.postMessage(JSON.stringify({ type: "interval cleared after 10 seconds"}));
    }, 10000); // 10 seconds
  }

`;