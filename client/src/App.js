import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import './tool/ThumbnailTool.js'

import './App.css';
import ThumbnailTool from './tool/ThumbnailTool.js';


const TOOLS = [
  {
    "name": "썸네일 메이커",
    "to": "/thumbnail-tool",
    "imageURL": "images/thumbnail_maker.png"
  }
]

function Header() {
  return (
    <div className="header">
      <img className="header-image" src="./images/toolkit.png" alt="cjwoov tookit"/>
      <h1>CJWOOV의 도구상자⚒️</h1>
    </div>
  );
}

function Tool({name, to, imageURL}) {
  return (
    <Link className="flex-item" to={to}>
      {imageURL && <img src={imageURL} alt={name}/>}
      <div className="flex-item-name">{name}</div>
    </Link>
  )
}

function Home() {
  return (
    <div className="flex-container">
      {TOOLS.map(element => {
              return (
                <Tool key={element.to} name={element.name} to={element.to} imageURL={element.imageURL}/>
              );
            })}
      <Tool name="개발 중" imageURL=""/>
      <Tool name="개발 중" imageURL=""/>
      <Tool name="개발 중" imageURL=""/>
      <Tool name="개발 중" imageURL=""/>
      <Tool name="개발 중" imageURL=""/>
      <Tool name="개발 중" imageURL=""/>
    </div>
  )
}

function ToolkitApp() {
  return (
    <>
      <Header/>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/thumbnail-tool" element={<ThumbnailTool/>}/>
        </Routes>
      </Router>
    </>

  );
}

export default ToolkitApp;
