import { Button } from 'antd';

const DataUpload = () => {
  

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
      />
      <Button type="default" size="medium">Upload File</Button>
    </div>
  );
};

export default DataUpload;