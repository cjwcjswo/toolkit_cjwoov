import React from "react";
import Link from 'next/link';

import styles from './index.module.css';


const TOOLS = [
    {
      "name": "썸네일 메이커",
      "to": "/thumbnail-maker",
      "imageURL": "images/thumbnail_maker.png"
    },
    {
      "name": "카드뉴스 생성기",
      "to": "/card-news",
      "imageURL": "images/card_news.png"
    }
  ]

function Tool({name, to, imageURL}) {
    return (
        <Link className={styles.item} href={to}>
            {imageURL && <img src={imageURL} alt={name} className={styles.itemImg}/>}
            <div className={styles.itemName}>{name}</div>
        </Link>
    )
}

function Home() {
    return (
      <div className={styles.container}>
        {TOOLS.map(element => {
                return (
                  <Tool key={element.to} name={element.name} to={element.to} imageURL={element.imageURL}/>
                );
              })}
        <Tool name="테스트 페이지" imageURL="" to="/test-page"/>
        <Tool name="개발 중" imageURL="" to=""/>
        <Tool name="개발 중" imageURL="" to=""/>
        <Tool name="개발 중" imageURL="" to=""/>
        <Tool name="개발 중" imageURL="" to=""/>
        <Tool name="개발 중" imageURL="" to=""/>
      </div>
    );
}

export default Home;