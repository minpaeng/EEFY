import React, { useState, useEffect } from 'react';
import * as S from './ProblemBox.style';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userData } from '@/recoil/Auth';
import { Homework, Category, HomeworkProblem } from '@/recoil/Homework';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { postHomeworkMakeQuestion } from '@/api/Homework/Problem';
import { OcrData } from '@/recoil/Library/CreateHomework/CreateReading';
import {HomeworkIdAtom} from '@/recoil/Library/CreateHomework/CreateHomework';

interface HomeworkProblemType {
  title: string;
  content: string;
  choiceRequests: any;
}
function ProblemBox() {
  const [homework, setHomework] = useRecoilState(HomeworkIdAtom);
  const [homeworkProblem, setHomeworkProblem] = useRecoilState<HomeworkProblemType[]>(HomeworkProblem);
  const [category, setCategory] = useRecoilState(Category);
  const [user, setUser] = useRecoilState(userData);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [answer, setAnswer] = useState('');
  const [count, setCount] = useState(0);
  const [choiceRequest, setChoiceRequest] = useState<any>([]);
  const [ocrDatas, setOcrDatas] = useRecoilState(OcrData);

  useEffect(() => {
    console.log(homeworkProblem);
    if (homeworkProblem.length > 0) {
      setTitle(homeworkProblem[homeworkProblem.length - 1].title);
      setContent(homeworkProblem[homeworkProblem.length - 1].content);
      setChoiceRequest(homeworkProblem[homeworkProblem.length - 1].choiceRequests);
      console.log(homeworkProblem[homeworkProblem.length - 1].title);
    }
  }, [homeworkProblem]);

  const handleTitle = (e: any) => {
    setTitle(e.target.value);
  };
  const handleContent = (e: any) => {
    setContent(e.target.value);
  };

  const handleChoiceContent = (value: any, number: any) => {
    setChoiceRequest((prevChoiceRequest:any) => {
      const updatedNumList = prevChoiceRequest.map((item:any) => {
        if (Number(item.number) === Number(number) + 1) {
          return { ...item, content: value };
        }
        return item;
      });
  
      return updatedNumList;
    });
  };

  const MakeProblem = async () => {
    const data = {
      title: title,
      content: content,
      field: 'CHOICE',
      answer: answer,
      choiceRequests: choiceRequest,
    };
    const makeHomeworkQuestionRequest = {
      homeworkId: homework,
      ...data,
    };
    console.log(makeHomeworkQuestionRequest, '<= makeHomeworkQuestionRequest');
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(makeHomeworkQuestionRequest)], {
      type: 'application/json',
    });
    formData.append('makeHomeworkQuestionRequest', jsonBlob);
    const newHomeworkProblem = [...homeworkProblem];
    newHomeworkProblem[homeworkProblem.length - 1] = data;
    const res = await postHomeworkMakeQuestion(formData, user.memberId);

    setOcrDatas({
      pdfFile:null,
      imgUrl:'',
      isSuccess:false
    })
    setHomeworkProblem(newHomeworkProblem);
    console.log(res);
    setCount(count + 1);
    setCategory('');
    setTitle('');
    setContent('');
    setAnswer('');
    setChoiceRequest([]);
  };

  return (
    <S.Container>
      <S.Wrappe className='w-full h-full flex flex-col'>
        <div
          style={{
            flex: 2,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <S.Title>
            <S.TitleInput onChange={e => handleTitle(e)} name='title' value={title} />
            <div style={{flex:0.5}}></div>
            <S.AnswerBox>
              <S.AnswerInput
                placeholder='정답을 입력학세요'
                onChange={e => {
                  setAnswer(e.target.value);
                }}
              />
            </S.AnswerBox>
          </S.Title>
        </div>
        <div style={{flex:0.5}}></div>
        <div style={{ flex: 4, width: '100%' }}>
          <S.ContentBox>
            <S.Content onChange={e => handleContent(e)} name='content' value={content} />
          </S.ContentBox>
        </div>
        <div style={{flex:0.5}}></div>

        <div style={{ flex: 4, width: '100%' }}>
          <S.NumberBox>
            {Array.isArray(choiceRequest) && choiceRequest.map((item: any, index: number) => (
              <div key={index} className='flex w-full'>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '12px 10px 0px 0px',
                    fontWeight: 'bold',
                    fontSize: '17px',
                  }}
                >
                  {item.number}.
                </div>
                <input
                  style={{
                    margin: '10px 0px 0px 0px',
                    width: '100%',
                    outline: 'none',
                    borderRadius: '8px',
                    padding: '5px 0px 0px 10px',
                    fontSize: '14px',
                    wordSpacing:'5px'
                  }}
                  value={item.content}
                  name='Numtitle'
                  onChange={e => handleChoiceContent(String(e.target.value), Number(index))}
                />
              </div>
            ))}
          </S.NumberBox>
        </div>

        <div style={{ flex: 2, width: '70%', margin:'0px auto 0px auto' }}>
          <S.BtnBox>
            <div
              style={{
                margin: '10px 0px 0px auto',
                cursor:'pointer'
              }}
              onClick={() => {
                MakeProblem();
              }}
            >
                <span style={{
                  border:'1px solid rgb(200, 200, 200, 0.5)',
                  borderRadius:'8px',
                  padding:'5px 5px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>save</span>
              {/* </div> */}
            </div>
          </S.BtnBox>
        </div>
      </S.Wrappe>
    </S.Container>
  );
}

export default ProblemBox;
