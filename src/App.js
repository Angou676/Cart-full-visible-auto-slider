import React, { useEffect, useRef, useState } from 'react';

function TrialCode() {
  const [data, setData] = useState([
    { id: 1456, name: 'Item 1' },
    { id: 2467, name: 'Item 2' },
    { id: 3547, name: 'Item 3' },
    { id: 4457, name: 'Item 4' },
    { id: 5456, name: 'Item 5' },
  ]);

  const cartListRef = useRef(null);
  const [visibleCartItemId, setVisibleCartItemId] = useState(null);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const cartItemId = entry.target.getAttribute('data-id');
        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
          console.log('Viewing cart item ID:', cartItemId);
          if (!visibleCartItemId) {
            setVisibleCartItemId(cartItemId);
          }
        } else if (cartItemId === visibleCartItemId) {
          console.log('Scrolled out cart item ID:', cartItemId);
          setVisibleCartItemId(null);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 1],
    });

    const cartList = cartListRef.current;
    const cartItems = cartList.querySelectorAll('.cart-item');
    cartItems.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      cartItems.forEach((item) => {
        observer.unobserve(item);
      });
    };
  }, [visibleCartItemId]);

  const handleScroll = () => {
    const cartList = cartListRef.current;
    const cartItems = cartList.querySelectorAll('.cart-item');

    cartItems.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const isVisible =
        itemRect.top >= 0 &&
        itemRect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
      const cartItemId = item.getAttribute('data-id');

      if (isVisible && cartItemId !== visibleCartItemId) {
        console.log('Viewing cart item ID:', cartItemId);
        if (!visibleCartItemId) {
          setVisibleCartItemId(cartItemId);
        }
      } else if (!isVisible && cartItemId === visibleCartItemId) {
        console.log('Scrolled out cart item ID:', cartItemId);
        setVisibleCartItemId(null);
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleCartItemId]);

  return (
    <div>
      <div
        ref={cartListRef}
        style={{ height: '70vh', overflowY: 'auto', position: 'relative', top: '200px', border: '2px solid red' }}
      >
        {data.map((item) => {
          console.log(visibleCartItemId, item.id.toString())
          return <div
            key={item.id}
            className="cart-item"
            data-id={item.id}
            style={{
              height: '300px',
              background: visibleCartItemId === item.id.toString() ? 'green' : 'grey',
            }}
          >
            {item.name}
          </div>
        })}
      </div>
    </div>
  );
}

export default TrialCode;
