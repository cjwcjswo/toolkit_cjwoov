import React, { useRef, useState, useEffect } from 'react';

const CardNews = ({page, setting}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    const [titleText, setTitleText] = useState('');
    const [contentText, setContentText] = useState('');

    useEffect(()=>{
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // 부모 div의 크기를 기준으로 캔버스 크기 설정
        const container = containerRef.current;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        ctx.fillStyle = setting.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (titleText !== '') {
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textX = canvas.width / 2;
            const textY = canvas.height / 2;

            ctx.fillText(titleText, textX, textY);
        }

        if (contentText !== '') {

        }
        
    },[canvasRef, setting, titleText, contentText]);

    const handleTitleTextChange = (e) => {
        setTitleText(e.target.value);
    }

    return (
        <div>
            <div ref={containerRef} className="min-w-[300px] max-w-[300px] relative justify-center items-center flex m-2 border-2 border-dashed border-gray-800 aspect-square rounded-lg hover:bg-red-300 hover:cursor-pointer">
                <div className='absolute top-2 bg-slate-500 bg-opacity-30 rounded-2xl p-1'>{page} 페이지</div>
                <canvas ref={canvasRef} className='w-full h-full'/>
            </div>
            <div className="m-2 hidden md:block">
                <div>
                    제목
                    <input type="text" className="w-full text-black" onChange={handleTitleTextChange}/>
                </div>
                <div className="mt-2 w-full">
                    내용 
                    <textarea className="w-full text-black" rows="5"/>
                </div>
            </div>
        </div>
    )
}

const DEFAULT_FONTS = ['Arial', 'Georgia', 'Times New Roman', 'Courier New'];
const CardNewsBasicSetting = (props) => {
    return (
        <div className="w-full border-gray-600 border-2 p-2">
            <div>
                대본 업로드: <input type="file"/>
            </div>
            <div className="mt-4">
                제목 색상: <input type="color"/>
            </div>
            <div className="mt-4">
                제목 크기: <input type="range" min="1" max="128" step="1" className="w-1/4"></input>
            </div>
            <div className="mt-4">
                내용 색상: <input type="color"/>
            </div>
            <div className="mt-4">
                내용 크기: <input type="range" min="1" max="128" step="1" className="w-1/4"></input>
            </div>
            <div className="mt-4">
                폰트 선택: 
                <select className="text-black ml-1">
                    {DEFAULT_FONTS.map((font, index) => {
                      return (<option value={font} key={index}>{font}</option>); 
                    })}
                </select>
            </div>
            <div className="mt-4">
                글자 수직 정렬:
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400">상단</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400">중앙</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400">하단</button>
            </div>
            <div className="mt-4">
                글자 수평 정렬:
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400">좌측</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400">중앙</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400">우측</button>
            </div>
            <div className="mt-4">
                글자 외곽선: <input type="range" min="0" max="10" step="1" className="w-1/4"></input>
            </div>
            <div className="mt-4">
                글자 외곽선 색상: <input type="color"/>
            </div>
            <div className="mt-4">
                배경 색상: <input type="color" onChange={(e) => {props.onChangeBackgroundColor(e.target.value)}}/>
            </div>
            <div className='mt-4'>
                배경 파일: <input type="file"/>
            </div>
        </div>
    );
}

const CardNewsMaker = ({setting}) => {
    const [cardList, setCardList] = useState([
        {
            "page": 1
        }
    ]);
    const scrollRef = useRef(null);

    useEffect(()=> {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [cardList]);

    const handleAddCardNews = () => {
        const currentPage = cardList.length;
        const newCardList = cardList.slice();
        newCardList.push({
            page: currentPage+1
        });
        console.log(newCardList);
        setCardList(newCardList);
    }

    return (
        <div ref={scrollRef} className='flex bg-zinc-950 border-double border-gray-900 border-4 wd-full overflow-auto'>
            <div className="flex flex-row justify-center items-center">
                {cardList.map((card)=>{
                    return (<CardNews key={card.page} page={card.page} setting={setting}/>);
                })}
                <button className='bg-zinc-700 px-2 rounded-full bg-opacity-80 text-center mx-12' onClick={handleAddCardNews}>+</button>
            </div>
        </div>
    );
}

const DEFAULT_SETTING = {
    "font": DEFAULT_FONTS[0],
    "titleColor": "black",
    "contentColor": "black",
    "textStrokeSize": 1,
    "textStrokeColor": "white",
    "textAlign": "left",
    "textBaseline": "top",
    "backgroundColor": "white",
    "backgroundImage": ""

};
const CardNewsPage = () => {
    const [setting, setSetting] = useState(DEFAULT_SETTING);


    // 배경 이미지 변경
    const handleChangeBackgroundColor = (color) => {
        setSetting({
            ...setting,
            "backgroundColor": color
        });
    }

    return (
        <>
            <h2 className="flex items-center">
                <img src="images/card_news.png" width="64px" height="64px" alt="카드뉴스 생성기" style={{ imageRendering: "pixelated" }}/>
                카드뉴스 생성기
            </h2>
            <div className="wd-full m-2">
                <CardNewsMaker setting={setting}/>
                <CardNewsBasicSetting
                    onChangeBackgroundColor={(color)=>{handleChangeBackgroundColor(color)}}
                />
            </div>
        </>
    );
}

export default CardNewsPage;