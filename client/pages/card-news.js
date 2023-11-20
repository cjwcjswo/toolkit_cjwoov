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
        console.log(setting);

        let textLines = 0;
        if (contentText !== '') {
            textLines = contentText.split('\n');
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        let textX = canvas.width / 2;
        let textY = 15;

        const MARGIN_X = 15;
        const MARGIN_Y = 15;

        if (titleText !== '') {
            ctx.fillStyle = setting.titleTextColor;
            ctx.font = `${setting.titleTextThickness} ${setting.titleTextSize}px ${setting.font}`
            if (setting.textHorizontalAlign === 'left') {
                ctx.textAlign = 'left';
                textX = MARGIN_X;
                textY = MARGIN_Y;
            } else if(setting.textHorizontalAlign === 'right') {
                ctx.textAlign = 'right';
                textX = canvas.width - MARGIN_X;
                textY = MARGIN_Y;
            }

            const textMetrics = ctx.measureText(titleText);
            ctx.fillText(titleText, textX, textY);
            textY += textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent + MARGIN_Y;
        }

        if (contentText !== '') {
            ctx.fillStyle = setting.contentTextColor;
            ctx.font = `${setting.contentTextThickness} ${setting.contentTextSize}px ${setting.font}`

            ctx.fillText(contentText, textX, textY);
        }
        
    },[canvasRef, setting, titleText, contentText]);

    const handleTitleTextChange = (e) => {
        setTitleText(e.target.value);
    }

    const handleContentTextChange = (e) => {
        setContentText(e.target.value);
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
                    <textarea className="w-full text-black" rows="5" onChange={handleContentTextChange}/>
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
                제목 색상: <input type="color" onChange={(e) => {props.onChangeTitleTextColor(e.target.value)}}/>
            </div>
            <div className="mt-4">
                제목 크기: <input type="range" min="1" max="128" step="1" className="w-1/4"
                                onChange={(e) => {props.onChangeTitleTextSize(e.target.value)}}/>
            </div>
            <div className="mt-4">
                제목 굵기: <input type="range" min="1" max="1000" step="1" className="w-1/4"
                                onChange={(e) => {props.onChangeTitleTextThickness(e.target.value)}}/>
            </div>
            <div className="mt-4">
                내용 색상: <input type="color" onChange={(e) => {props.onChangeContentTextColor(e.target.value)}}/>
            </div>
            <div className="mt-4">
                내용 크기: <input type="range" min="1" max="128" step="1" className="w-1/4"
                                onChange={(e) => {props.onChangeContentTextSize(e.target.value)}}/>
            </div>
            <div className="mt-4">
                내용 굵기: <input type="range" min="1" max="1000" step="1" className="w-1/4"
                                onChange={(e) => {props.onChangeContentTextThickness(e.target.value)}}/>
            </div>
            <div className="mt-4">
                폰트 선택: 
                <select className="text-black ml-1" onChange={(e)=>{props.onChangeFont(e.target.value)}}>
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
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400"
                    onClick={()=>{props.onClickTextHorizontalAlign('left')}}>좌측</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400"
                    onClick={()=>{props.onClickTextHorizontalAlign('center')}}>중앙</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400"
                    onClick={()=>{props.onClickTextHorizontalAlign('right')}}>우측</button>
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
    "titleTextColor": "black",
    "titleTextSize": 10,
    "titleTextThickness": 1,
    "contentTextColor": "black",
    "contentTextSize": 10,
    "contentTextThickness": 1,
    "textStrokeSize": 1,
    "textStrokeColor": "white",
    "textHorizontalAlign": "right",
    "textVerticalAlign": "top",
    "backgroundColor": "white",
    "backgroundImage": ""

};
const CardNewsPage = () => {
    const [setting, setSetting] = useState(DEFAULT_SETTING);

    // 폰트 변경
    const handleChangeFont = (font) => {
        setSetting({
            ...setting,
            "font": font
        });
    }

    // 제목 크기 변경
    const handleChangeTitleTextSize = (size) => {
        setSetting({
            ...setting,
            "titleTextSize": size
        });
    }

    // 제목 색상 변경
    const handleChangeTitleTextColor = (color) => {
        setSetting({
            ...setting,
            "titleTextColor": color
        });
    }

    // 제목 굵기 변경
    const handleChangeTitleTextThickness = (thickness) => {
        setSetting({
            ...setting,
            "titleTextThickness": thickness
        });
    }

    // 내용 크기 변경
    const handleChangeContentTextSize = (size) => {
        setSetting({
            ...setting,
            "contentTextSize": size
        });
    }

    // 내용 색상 변경
    const handleChangeContentTextColor = (color) => {
        setSetting({
            ...setting,
            "contentTextColor": color
        });
    }

    // 내용 굵기 변경
    const handleChangeContentTextThickness = (thickness) => {
        setSetting({
            ...setting,
            "contentTextThickness": thickness
        });
    }

    // 배경 색상 변경
    const handleChangeBackgroundColor = (color) => {
        setSetting({
            ...setting,
            "backgroundColor": color
        });
    }

    // 글자 수평 정렬
    const handleClickTextHorizontalAlign = (align) => {
        setSetting({
            ...setting,
            "textHorizontalAlign": align
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
                    onChangeFont={(font)=>{handleChangeFont(font)}}
                    onChangeTitleTextSize={(size)=>{handleChangeTitleTextSize(size)}}
                    onChangeTitleTextColor={(color)=>{handleChangeTitleTextColor(color)}}
                    onChangeTitleTextThickness={(thickness)=>{handleChangeTitleTextThickness(thickness)}}
                    onChangeContentTextSize={(size)=>{handleChangeContentTextSize(size)}}
                    onChangeContentTextColor={(color)=>{handleChangeContentTextColor(color)}}
                    onChangeContentTextThickness={(thickness)=>{handleChangeContentTextThickness(thickness)}}
                    onChangeBackgroundColor={(color)=>{handleChangeBackgroundColor(color)}}
                    onClickTextHorizontalAlign={(align)=>{handleClickTextHorizontalAlign(align)}}
                />
            </div>
        </>
    );
}

export default CardNewsPage;