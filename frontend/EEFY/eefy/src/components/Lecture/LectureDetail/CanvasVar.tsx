import { useRecoilState } from 'recoil';
import { CanvasVarData, PdfPage, CanvasData } from '@/recoil/Canvas';
import { OcrFileCheck } from '@/recoil/Homework';

import styled from 'styled-components';
import { LuEraser } from 'react-icons/lu';
import { LuPenLine } from 'react-icons/lu';
import { LiaHighlighterSolid } from 'react-icons/lia';
import { BlockPicker } from 'react-color';
import { ColorResult } from 'react-color';
import { HiArrowUturnLeft, HiArrowUturnRight } from 'react-icons/hi2';
import { BiSolidLeftArrow, BiSolidRightArrow, BiSolidDoorOpen } from 'react-icons/bi';
import { FaRegTrashCan } from 'react-icons/fa6';
import {postLecture} from '@/api/Lecture/Lecture'
import { useParams } from 'next/navigation';
function CanvasVar() {
  const params = useParams()
  const [data, setData] = useRecoilState(CanvasData);
  const [varData, setVarData] = useRecoilState(CanvasVarData);
  const [ocr, setOcr] = useRecoilState(OcrFileCheck);
  const [page, setPage] = useRecoilState(PdfPage);

  const exportCanvasPenMode = () => {
    if (varData.penSize === 10) {
      const originalColor = varData.color;
      const components = originalColor.match(/(\d+(\.\d+)?)/g);
      if (components && components.length === 4) {
        const r = parseInt(components[0]);
        const g = parseInt(components[1]);
        const b = parseInt(components[2]);

        // 알파 채널을 1로 설정하여 진한 색상 생성
        const newRgbaColor = `rgba(${r}, ${g}, ${b}, 1)`;

        setVarData({ ...varData, mode: false, penSize: 4, color: newRgbaColor });
      }
    } else {
      setVarData({ ...varData, mode: false, penSize: 4, color: varData.color });
    }
  };
  const exportCanvasHighlighterMode = () => {
    if (varData.penSize === 4) {
      const originalColor = varData.color;
      const components = originalColor.match(/(\d+(\.\d+)?)/g);
      if (components && components.length === 4) {
        const r = parseInt(components[0]);
        const g = parseInt(components[1]);
        const b = parseInt(components[2]);

        // 알파 채널을 1로 설정하여 진한 색상 생성
        const newRgbaColor = `rgba(${r}, ${g}, ${b}, 0.4)`;

        setVarData({ ...varData, mode: false, penSize: 10, color: newRgbaColor });
      } else {
        const alpha = 0.4;
        const rgbaColor = `rgba(${parseInt(originalColor.slice(1, 3), 16)}, ${parseInt(originalColor.slice(3, 5), 16)}, ${parseInt(
          originalColor.slice(5, 7),
          16
        )}, ${alpha})`;
        setVarData({ ...varData, mode: false, penSize: 10, color: rgbaColor });
      }
    } else {
      setVarData({ ...varData, mode: false, penSize: 10, color: varData.color });
    }
  };
  const exportCanvasEraseMode = () => {
    setVarData({ ...varData, mode: true });
  };
  const handleChangeComplete = (color: ColorResult) => {
    if (varData.penSize === 10) {
      const originalColor = color.hex;
      const alpha = 0.4;
      const rgbaColor = `rgba(${parseInt(originalColor.slice(1, 3), 16)}, ${parseInt(originalColor.slice(3, 5), 16)}, ${parseInt(
        originalColor.slice(5, 7),
        16
      )}, ${alpha})`;
      setVarData({ ...varData, color: rgbaColor, penSize: 10 });
    } else if (varData.penSize == 4) {
      const originalColor = color.hex;
      const alpha = 1;
      const rgbaColor = `rgba(${parseInt(originalColor.slice(1, 3), 16)}, ${parseInt(originalColor.slice(3, 5), 16)}, ${parseInt(
        originalColor.slice(5, 7),
        16
      )}, ${alpha})`;
      setVarData({ ...varData, color: color.hex, penSize: 4 });
    }
  };

  const handleBeforePage = () => {
    if (ocr.pdfFile) {
      if (page.pageNumber > 1) {
        setPage({ ...page, pageNumber: page.pageNumber - 1, btnType: 'before' });
      }
    }
  };

  const handleNextPage = () => {
    if (ocr.pdfFile) {
      if (page.pageNumber < page.numPages) {
        setPage({ ...page, pageNumber: page.pageNumber + 1, btnType: 'next' });
      }
    }
  };

  const postSaveLecture = async ()=>{
    console.log('글 저장', data)
    const deleteData = data.filter((item:any) => item.drawInfo.length !== 0);
    console.log(setData,'setData')
    const newData = {
      lectureId:Number(params.lectureId),
      canvasData:deleteData
    }
    const res = await postLecture(newData)
    console.log(res)
    setData([]);
  }

  return (
    <Container className="flex flex-col">
      <div style={{ borderBottom: '1px solid rgba(131, 129, 129, 0.5)' }}>
        <BlockPicker
          triangle='hide'
          color={varData.color}
          colors={[
            '#000000',
            '#795548',
            '#607d8b',
            '#f44336',
            '#ff5722',
            '#e91e63',
            '#9c27b0',
            '#673ab7',
            '#3f51b5',
            '#2196f3',
            '#8bc34a',
            '#ffc107',
            '#ff9800',
          ]}
          onChangeComplete={handleChangeComplete}
        />
      </div>

        <div style={{flex:1, height:'100%'}}>    
        <ItemPenBox>
          <PenBox
            onClick={exportCanvasPenMode}
            style={{
              borderRight: '1px solid rgba(131, 129, 129, 0.5)',
              backgroundColor: varData.mode ? '' : varData.penSize === 4 ? 'rgba(200, 200, 200, 0.5)' : '',
            }}
          >
            <LuPenLine style={{ fontSize: '23px', color: varData.color }} />
          </PenBox>
          <PenBox
            onClick={exportCanvasHighlighterMode}
            style={{
              backgroundColor: varData.mode ? '' : varData.penSize === 10 ? 'rgba(200, 200, 200, 0.5)' : '',
            }}
          >
            <LiaHighlighterSolid style={{ fontSize: '23px' }} />
          </PenBox>
        </ItemPenBox>
        </div>
        <div style={{flex:1, height:'100%'}}>
          <ItemDeleteBox>
            <EraserBox
              onClick={exportCanvasEraseMode}
              style={{
                backgroundColor: varData.mode ? 'rgba(200, 200, 200, 0.5)' : '',
              }}
            >
              <LuEraser style={{ fontSize: '23px' }} />
            </EraserBox>
            <ClearBox
              onClick={() => {
                setVarData({ ...varData, clear: true });
              }}
            >
              <FaRegTrashCan />
            </ClearBox>
          </ItemDeleteBox>
        </div>
        <div style={{flex:1, height:'100%'}}>
          <ItemBox>
            <UndoBtn
              onClick={() => {
                setVarData({ ...varData, undo: true });
              }}
            >
              <HiArrowUturnLeft />
            </UndoBtn>
            <RedoBtn
              onClick={() => {
                setVarData({ ...varData, redo: true });
              }}
            >
              <HiArrowUturnRight />
            </RedoBtn>
          </ItemBox>
        </div>
        <div style={{flex:1, height:'100%'}}>
          <PdfPageItemBox>
            <BeforeBtn onClick={handleBeforePage}>
              <BiSolidLeftArrow />
            </BeforeBtn>
            <PdfPageItem>
              {page.pageNumber} / {page.numPages}
            </PdfPageItem>
            <NextBtn onClick={handleNextPage}>
              <BiSolidRightArrow />
            </NextBtn>
          </PdfPageItemBox>
        </div>

        <div style={{flex:1, height:'100%'}}>
          <BackBtn
            onClick={() => {
              postSaveLecture()
              setOcr({ ...ocr, isSuccess: false, imgUrl: '', pdfFile: '' });
              setPage({ ...page, pageNumber: 1, numPages: 0 });
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', border:'1px soild black'}}>
              <BiSolidDoorOpen style={{ fontSize: '21px' }} />
              BACK
            </div>
          </BackBtn>
        </div>
    </Container>
  );
}

export default CanvasVar;

const Container = styled.div`
  margin: 0px 0px auto 0px;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(131, 129, 129, 0.25);
  border-radius: 12px;
`;
const PenBox = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  color: rgba(70, 70, 70, 0.8);
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(131, 129, 129, 0.5);
  @media (max-width: 1334px) {
    padding: 8px 5px;
  }
  /* &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  } */
`;
const EraserBox = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  color: rgba(70, 70, 70, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
  border-bottom: 1px solid rgba(131, 129, 129, 0.5);
  border-right: 1px solid rgba(131, 129, 129, 0.5);
  @media (max-width: 1334px) {
    padding: 8px 5px;
  }
  /* &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  } */
`;
const ClearBox = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  color: rgba(70, 70, 70, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
  border-bottom: 1px solid rgba(131, 129, 129, 0.5);
  @media (max-width: 1334px) {
    padding: 8px 5px;
  }
  /* &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  } */
`;
const BackBtn = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  color: #dc4c64;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  height: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  @media (max-width: 1334px) {
  }
  /* &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  } */
`;
const ItemPenBox = styled.div`
  display: flex;
   height:100%;
`;
const ItemDeleteBox = styled.div`
  display: flex;
   height:100%;
`;
const ItemBox = styled.div`
  display: flex;
  height:100%;
  background-color: rgba(255, 255, 255, 0.5);
  color: rgba(70, 70, 70, 0.8);
`;
const PdfPageItemBox = styled.div`
  display: flex;
   height:100%;
  background-color: rgba(255, 255, 255, 0.5);
  font-weight: 550;
  color: rgba(70, 70, 70, 0.8);
`;
const BeforeBtn = styled.div`
  flex: 1;
  font-size: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid rgba(131, 129, 129, 0.5);
  border-bottom: 1px solid rgba(131, 129, 129, 0.5);
  /* &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  } */
`;
const PdfPageItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  border-right: 1px solid rgba(131, 129, 129, 0.5);
  border-bottom: 1px solid rgba(131, 129, 129, 0.5);
  /* &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  } */
`;
const NextBtn = styled.div`
  font-size: 23px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(131, 129, 129, 0.5);
  /* &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  } */
`;
const UndoBtn = styled.div`
  flex: 1;
  display: flex;
  font-size: 23px;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(131, 129, 129, 0.5);
  border-right: 1px solid rgba(131, 129, 129, 0.5);
  /* &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  } */
`;
const RedoBtn = styled.div`
  flex: 1;
  display: flex;
  font-size: 23px;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(131, 129, 129, 0.5);
  /* &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  } */
`;
