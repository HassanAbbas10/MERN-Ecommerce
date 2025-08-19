import { useState } from 'react';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';

const SimpleCanvasTest = () => {
  const [testImage, setTestImage] = useState(null);

  const loadTestImage = () => {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Test image loaded successfully');
      setTestImage(img);
    };
    img.onerror = (error) => {
      console.error('❌ Failed to load test image:', error);
    };
    // Use a simple data URL for testing
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmY2NjAwIi8+CiAgICA8dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRlc3Q8L3RleHQ+Cjwvc3ZnPg==';
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Canvas Test</h2>
      
      <button 
        onClick={loadTestImage}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Load Test Image
      </button>
      
      <div className="border border-gray-300">
        <Stage width={400} height={300} style={{ backgroundColor: '#f0f0f0' }}>
          <Layer>
            {/* Test rectangle */}
            <Rect
              x={20}
              y={20}
              width={100}
              height={60}
              fill="red"
              stroke="black"
              strokeWidth={2}
            />
            
            {/* Test text */}
            <Text
              x={140}
              y={40}
              text="Konva is working!"
              fontSize={16}
              fill="blue"
            />
            
            {/* Test image */}
            {testImage && (
              <Image
                image={testImage}
                x={200}
                y={20}
                width={100}
                height={100}
              />
            )}
          </Layer>
        </Stage>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Debug Info:
        <br />
        Test Image: {testImage ? '✅ Loaded' : '❌ Not loaded'}
      </div>
    </div>
  );
};

export default SimpleCanvasTest;
