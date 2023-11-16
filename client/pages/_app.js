import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script'

import '../styles.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta
                    name="CJWOOV의 도구상자⚒️"
                    content="여러가지 유용한 툴들을 모은 비밀 공간입니다.😘"
                />
                <title>CJWOOV의 도구상자⚒️</title>
                <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3369836132423900" crossOrigin="anonymous"/>
            </Head>
            <Link href="/" className="noStyle">
                <div className="header">
                    <img className="headerImage" src="./images/toolkit.png" alt="cjwoov tookit"/>
                    <h1>CJWOOV의 도구상자</h1>
                </div>
            </Link>
            <Component {...pageProps} />
        </>
    );
  }