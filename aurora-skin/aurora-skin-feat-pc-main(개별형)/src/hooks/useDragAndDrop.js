import { useState } from 'react';

const useDragAndDrop = ({ initialLeft, initialTop }) => {
  // 드리그 전 포지션 값
  const [originalPosition, setOriginalPosition] = useState({
    left: 0,
    top: 0,
  });

  // 실시간
  const [realTimePosition, setRealTimePosition] = useState({
    left: 0,
    top: 0,
  });

  // 실제 위치하는 값
  const [position, setPosition] = useState({
    left: initialLeft,
    top: initialTop,
  });

  const handleDragStart = (event) => {
    event.stopPropagation();

    // 크롬 초록색 플러스 버튼 아이콘 제거
    event.dataTransfer.effectAllowed = 'move';
    const _originalPosition = { ...originalPosition };
    _originalPosition.left = event.target.offsetLeft;
    _originalPosition.top = event.target.offsetTop;

    // 드래그 시작 전 위치값 저장
    setOriginalPosition(() => ({
      ..._originalPosition,
    }));

    const _realTimePosition = { ...realTimePosition };
    _realTimePosition.left = event.clientX;
    _realTimePosition.top = event.clientY;

    setRealTimePosition(() => ({
      ..._realTimePosition,
    }));
  };

  const handleDrag = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const _pos = { ...position };

    const left = event.target.offsetLeft + event.clientX - realTimePosition.left;
    const top = event.target.offsetTop + event.clientY - realTimePosition.top;
    _pos.left = left < 0 ? position.left : left;
    _pos.top = top < 0 ? position.top : top;

    setPosition(() => ({
      ..._pos,
    }));

    const _realTimePosition = { ...realTimePosition };
    _realTimePosition.left = event.clientX;
    _realTimePosition.top = event.clientY;

    setRealTimePosition(() => ({
      ..._realTimePosition,
    }));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnd = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    handleDragStart,
    handleDrag,
    handleDragOver,
    handleDragEnd,
    position,
  };
};

export default useDragAndDrop;
