import { supabaseClient }
from './supabase.js';



// =======================
// 当前文章信息
// =======================

const articleId = window.articleId;

const articleLang = window.articleLang;



// =======================
// 获取访客ID
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
// 获取统计数据
// =======================

async function loadStats(){


    const {
        data,
        error
    } = await supabaseClient

    .from('article_stats')

    .select(
        'views,likes,favorites'
    )

    .eq(
        'article_id',
        articleId
    )

    .eq(
        'lang',
        articleLang
    )

    .maybeSingle();



    if(error){

        console.error(
            '读取统计失败:',
            error
        );

        return;

    }



    if(data){


        document
        .querySelector('#views-count')
        .textContent =
        data.views;



        document
        .querySelector('#likes-count')
        .textContent =
        data.likes;



        document
        .querySelector('#favorites-count')
        .textContent =
        data.favorites;


    }

}





// =======================
// 阅读量 +1
// =======================

async function addView(){


    const {
        error
    } = await supabaseClient.rpc(

        'add_view',

        {

            aid: articleId,

            alang: articleLang

        }

    );



    if(error){

        console.error(
            '阅读量增加失败:',
            error
        );

    }

}





// =======================
// 点赞切换
// =======================

async function toggleLike(){


    const {

        data,

        error

    } = await supabaseClient.rpc(

        'toggle_like',

        {

            aid: articleId,

            alang: articleLang,

            vid: getVisitorId()

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


    loadStats();

}





// =======================
// 收藏切换
// =======================

async function toggleFavorite(){


    const {

        data,

        error

    } = await supabaseClient.rpc(

        'toggle_favorite',

        {

            aid: articleId,

            alang: articleLang,

            vid:getVisitorId()

        }

    );



    if(error){

        console.error(
            '收藏失败:',
            error
        );

        return;

    }



    updateFavoriteButton(data);


    loadStats();

}





// =======================
// 检查当前用户状态
// =======================

async function loadActionStatus(){


    const {

        data,

        error

    } = await supabaseClient.rpc(

        'get_action_status',

        {

            aid:articleId,

            alang:articleLang,

            vid:getVisitorId()

        }

    );



    if(error){

        console.error(
            '获取状态失败:',
            error
        );

        return;

    }



    if(data){


        updateLikeButton(
            data.liked
        );


        updateFavoriteButton(
            data.favorited
        );

    }


}





// =======================
// 更新点赞按钮
// =======================

function updateLikeButton(active){


    const btn =
    document.querySelector(
        '#like-button'
    );


    if(!btn)
    return;



    if(active){


        btn.classList.add(
            'liked'
        );


        btn.innerHTML =
        '♥ 已点赞';


    }
    else{


        btn.classList.remove(
            'liked'
        );


        btn.innerHTML =
        '♡ 点赞';


    }

}





// =======================
// 更新收藏按钮
// =======================

function updateFavoriteButton(active){


    const btn =
    document.querySelector(
        '#favorite-button'
    );


    if(!btn)
    return;



    if(active){


        btn.classList.add(
            'favorited'
        );


        btn.innerHTML =
        '★ 已收藏';


    }
    else{


        btn.classList.remove(
            'favorited'
        );


        btn.innerHTML =
        '☆ 收藏';


    }

}





// =======================
// 初始化
// =======================

async function init(){


    if(!articleId || !articleLang){

        console.error(
            '缺少 article_id 或 lang'
        );

        return;

    }



    console.log(
        'article:',
        articleId,
        articleLang
    );



    await addView();


    await loadStats();


    await loadActionStatus();


}





// =======================
// DOM事件
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



    document

    .querySelector(
        '#favorite-button'
    )

    ?.addEventListener(

        'click',

        toggleFavorite

    );



    init();


});