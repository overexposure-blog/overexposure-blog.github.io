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


        id =
        crypto.randomUUID();


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


        const views =
        document.querySelector(
            '#views-count'
        );


        const likes =
        document.querySelector(
            '#likes-count'
        );


        const favorites =
        document.querySelector(
            '#favorites-count'
        );



        if(views)
        views.textContent =
        data.views;



        if(likes)
        likes.textContent =
        data.likes;



        if(favorites)
        favorites.textContent =
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
// 点赞 / 取消点赞
// =======================

async function toggleLike(){


    const {

        data,

        error

    } = await supabaseClient.rpc(

        'toggle_like',

        {

            p_article_id: articleId,

            p_lang: articleLang,

            p_visitor_id: getVisitorId()

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
// 收藏 / 取消收藏
// =======================

async function toggleFavorite(){


    const {

        data,

        error

    } = await supabaseClient.rpc(

        'toggle_favorite',

        {

             p_article_id: articleId,

        p_lang: articleLang,

        p_visitor_id: getVisitorId()

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


    await loadStats();


}





// =======================
// 获取当前用户状态
// =======================

async function loadActionStatus(){


    const {

        data,

        error

    } = await supabaseClient.rpc(

        'get_action_status',

        {

            p_article_id: articleId,

            p_lang: articleLang,

            vid:getVisitorId()

        }

    );



    if(error){


        console.error(
            '状态读取失败:',
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
        '♥ 已赞';



    }else{


        button.classList.remove(
            'liked'
        );


        button.innerHTML =
        '♡ 点赞';


    }


}





// =======================
// 更新收藏按钮
// =======================

function updateFavoriteButton(active){


    const button =
    document.querySelector(
        '#favorite-button'
    );


    if(!button)
    return;



    if(active){


        button.classList.add(
            'favorited'
        );


        button.innerHTML =
        '★ 已收藏';



    }else{


        button.classList.remove(
            'favorited'
        );


        button.innerHTML =
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
// 事件绑定
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