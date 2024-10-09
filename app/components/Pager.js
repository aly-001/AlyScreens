import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Pager = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const prevTranslate = useRef(0);
  const animationRef = useRef(null);
  const isDragging = useRef(false);

  const handleTouchStart = (index) => (event) => {
    startX.current = getPositionX(event);
    isDragging.current = true;
    animationRef.current = requestAnimationFrame(animation);
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleTouchMove = (event) => {
    if (isDragging.current) {
      const currentPosition = getPositionX(event);
      currentTranslate.current = prevTranslate.current + currentPosition - startX.current;
    }
  };

  const handleTouchEnd = () => {
    cancelAnimationFrame(animationRef.current);
    const movedBy = currentTranslate.current - prevTranslate.current;

    if (movedBy < -100 && currentIndex < children.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    if (movedBy > 100 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setPositionByIndex();
    isDragging.current = false;
    containerRef.current.style.cursor = 'grab';
  };

  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  };

  const animation = () => {
    setSliderPosition();
    if (isDragging.current) {
      requestAnimationFrame(animation);
    }
  };

  const setSliderPosition = () => {
    containerRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
  };

  const setPositionByIndex = () => {
    currentTranslate.current = currentIndex * -window.innerWidth;
    prevTranslate.current = currentTranslate.current;
    setSliderPosition();
  };

  useEffect(() => {
    setPositionByIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Inline Styles
  const styles = {
    pagerContainer: {
      display: 'flex',
      overflow: 'hidden',
      cursor: 'grab',
      width: `${children.length * 100}vw`,
      height: '100%',
      touchAction: 'pan-y',
      transition: isDragging.current ? 'none' : 'transform 0.3s ease-out',
    },
    pagerView: {
      flexShrink: 0,
      width: '100vw',
      height: '100%',
    },
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart(currentIndex)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart(currentIndex)}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => {
        if (isDragging.current) handleTouchEnd();
      }}
      style={styles.pagerContainer}
    >
      {React.Children.map(children, (child, index) => (
        <div
          style={styles.pagerView}
          key={index}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

Pager.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Pager;
