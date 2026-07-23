import { supabaseClient }
from './supabase.js';


// =======================
// 文章信息
// =======================

const articleId = window.articleId;

const articleLang = window.articleLang;


// =======================
// 访问时间
// =======================

const startTime = Date.now();


// =======================
// 获取 visitor_id
// =======================

function getVisitorId(){

    let id =
    localStorage.getItem(
        'visitor_id'
    );


    if(!id){

        id = crypto.randomUUID();

        localStorage.setItem(
            'visitor_id',
            id
        );

    }


    return id;

}


// =======================
// 获取 session_id
// =======================

function getSessionId(){

    let id =
    sessionStorage.getItem(
        'session_id'
    );


    if(!id){

        id = crypto.randomUUID();


        sessionStorage.setItem(
            'session_id',
            id
        );

    }


    return id;

}



const visitorId = getVisitorId();

const sessionId = getSessionId();




// =======================
// 设备
// =======================

function getDevice(){

    return /mobile/i.test(
        navigator.userAgent
    )
    ?
    'mobile'
    :
    'desktop';

}


// =======================
// 来源
// =======================

function getSource(){

    const ref =
    document.referrer;


    if(!ref){

        return 'direct';

    }


    if(ref.includes('google')){

        return 'google';

    }


    if(ref.includes('bing')){

        return 'bing';

    }


    return 'external';

}





// =======================
// 添加阅读 UV
// =======================

async function addView(){


    const {
        error
    } = await supabaseClient.rpc(

        'add_view',

        {

            p_article_id: articleId,

            p_lang: articleLang,

            p_visitor_id: visitorId,

            p_session_id: sessionId,

            p_device:
            getDevice(),

            p_source:
            getSource()

        }

    );


    if(error){

        console.error(
            'add_view失败:',
            error
        );

    }


}




// =======================
// 获取统计
// =======================

async function loadStats(){


    const {

        data,

        error

    } = await supabaseClient.rpc(

        'get_article_stats',

        {

            p_article_id:
            articleId,


            p_lang:
            articleLang

        }

    );



    if(error){

        console.error(
            '统计读取失败:',
            error
        );

        return;

    }



    if(data){


        const views =
        document.querySelector(
            '#views-count'
        );


        const likes =
        document.querySelector(
            '#likes-count'
        );



        if(views){

            views.textContent =
            data.views || 0;

        }



        if(likes){

            likes.textContent =
            data.likes || 0;

        }


    }


}





// =======================
// 点赞
// =======================

async function toggleLike(){



    const {

        data,

        error

    } = await supabaseClient.rpc(

        'toggle_like',

        {


            p_article_id:
            articleId,


            p_lang:
            articleLang,


            p_visitor_id:
            visitorId


        }

    );



    if(error){

        console.error(
            '点赞失败:',
            error
        );

        return;

    }



    updateLikeButton(data);


    await loadStats();


}





// =======================
// 获取点赞状态
// =======================

async function loadActionStatus(){


    const {

        data,

        error

    } = await supabaseClient.rpc(

        'get_action_status',

        {

            p_article_id:
            articleId,


            p_lang:
            articleLang,


            p_visitor_id:
            visitorId

        }

    );



    if(error){

        console.error(
            '状态读取失败:',
            error
        );

        return;

    }



    updateLikeButton(data);


}





// =======================
// 更新点赞按钮
// =======================

function updateLikeButton(active){


    const button =
    document.querySelector(
        '#like-button'
    );



    if(!button)
    return;



    if(active){


        button.classList.add(
            'liked'
        );


        button.innerHTML =
        '❤';


    }

    else{


        button.classList.remove(
            'liked'
        );


        button.innerHTML =
        '♡';


    }


}







// =======================
// 阅读深度
// =======================

function getScrollDepth(){


    const height =
    document.documentElement.scrollHeight
    -
    window.innerHeight;


    if(height <=0){

        return 100;

    }


    return Math.min(

        100,

        Math.round(

            window.scrollY /
            height *
            100

        )

    );

}




// =======================
// 是否完成阅读
// =======================

function isCompleted(){


    return getScrollDepth() >= 80;

}





// =======================
// 更新阅读数据
// =======================

async function updateReading(){


    const duration =
    Math.floor(

        (Date.now()-startTime)
        /
        1000

    );



    const scrollDepth =
    getScrollDepth();



    const completed =
    isCompleted();



    const {

        error

    } = await supabaseClient.rpc(

        'update_reading',

        {

            p_article_id:
            articleId,


            p_lang:
            articleLang,


            p_visitor_id:
            visitorId,


            p_session_id:
            sessionId,


            p_duration:
            duration,


            p_scroll_depth:
            scrollDepth,


            p_is_completed:
            completed


        }

    );



    if(error){

        console.error(
            '阅读更新失败:',
            error
        );

    }


}






// =======================
// 初始化
// =======================

async function init(){


    if(!articleId || !articleLang){

        console.error(
            '缺少文章信息'
        );

        return;

    }



    await addView();


    await loadStats();


    await loadActionStatus();


}





// =======================
// 事件
// =======================


document.addEventListener(

'DOMContentLoaded',

()=>{


    document

    .querySelector(
        '#like-button'
    )

    ?.addEventListener(

        'click',

        toggleLike

    );



    init();


});





// =======================
// 页面离开
// =======================


window.addEventListener(

'beforeunload',

()=>{


    updateReading();


});