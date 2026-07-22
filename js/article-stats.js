import { supabaseClient }
from './supabase.js';



const articleId = window.articleId;



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
            aid: articleId
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
// 点赞
// =======================

async function addLike(){


    const {
        error
    } = await supabaseClient.rpc(

        'add_like',

        {
            aid: articleId
        }

    );



    if(error){

        console.error(
            '点赞失败:',
            error
        );

        return;

    }



    loadStats();

}





// =======================
// 收藏
// =======================

async function addFavorite(){


    const {
        error
    } = await supabaseClient.rpc(

        'add_favorite',

        {
            aid: articleId
        }

    );



    if(error){

        console.error(
            '收藏失败:',
            error
        );

        return;

    }



    loadStats();

}





// =======================
// 初始化
// =======================

async function init(){


    if(!articleId){

        console.error(
            'article_id不存在'
        );

        return;

    }



    console.log(
        'article:',
        articleId
    );



    await addView();


    await loadStats();


}





// =======================
// 绑定事件
// =======================

document.addEventListener(
'DOMContentLoaded',
()=>{


    document
    .querySelector('#like-button')
    ?.addEventListener(
        'click',
        addLike
    );



    document
    .querySelector('#favorite-button')
    ?.addEventListener(
        'click',
        addFavorite
    );



    init();


});