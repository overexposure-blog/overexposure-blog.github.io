import { supabase }
from './supabase.js';



const articleId =
window.articleId;



// ==========================
// 获取统计数据
// ==========================

async function loadStats(){


    const {

        data,
        error

    } = await supabase

    .from('article_stats')

    .select('*')

    .eq(
        'article_id',
        articleId
    )

    .maybeSingle();



    if(error){

        console.log(error);

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





// ==========================
// 阅读量 +1
// ==========================

async function addView(){


    const {

        error

    } = await supabase.rpc(

        'add_view',

        {

            aid:articleId

        }

    );



    if(error){

        console.log(error);

    }

}





// ==========================
// 点赞
// ==========================

async function addLike(){


    const {

        error

    } = await supabase.rpc(

        'add_like',

        {

            aid:articleId

        }

    );



    if(error){

        console.log(error);

        return;

    }


    loadStats();


}





// ==========================
// 收藏
// ==========================

async function addFavorite(){


    const {

        error

    } = await supabase.rpc(

        'add_favorite',

        {

            aid:articleId

        }

    );


    if(error){

        console.log(error);

        return;

    }


    loadStats();

}





// ==========================
// 绑定按钮
// ==========================

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





// ==========================
// 页面初始化
// ==========================

async function init(){


    if(!articleId){

        return;

    }



    await addView();


    await loadStats();


}



init();