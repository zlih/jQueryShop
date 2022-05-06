//渲染商品分类
getCateList()
function getCateList(params) {
  $.get('http://localhost:2332/goods/category', res => {
    // console.log(res);
    let str = `<li class="active">全部</li>`
    res.list.forEach(function (item) {
      // console.log(item);
      str += `<li>${item}</li>`
      $('.category').html(str)
    })
  })
}

//渲染商品列表
const info = {
  current: 3,
  pagesize: 16,
  search: '',
  filter: '',
  saleType: '10',
  sortType: 'id',
  sortMethod: 'ASC',
  category: ''
}

let totalPage = ''

getGoodsList()
function getGoodsList() {
  $.get('http://localhost:2332/goods/list', info, res => {
    // console.log(res);
    totalPage = res.total
    bindHtml(res)
  })
}

function bindHtml(res) {
  //判断小于号什么时候加上类名
  if (info.current === 1) {
    $('.left').addClass('disable')
  } else {
    $('.left').removeClass('disable')
  }
  //判断大于号什么时候加上类名
  if (info.current === res.total) {
    $('.right').addClass('disable')
  } else {
    $('.right').removeClass('disable')
  }
  //渲染当前页/尾页
  $('.total').text(`${info.current} / ${res.total}`)

  //渲染一页显示多少条数据, 注意pagesize得是option里有的值才生效
  $('select').val(info.pagesize)

  //渲染当前页数
  $('.page').val(info.current)

  let str = ``
  res.list.forEach(function (item) {
    // console.log(item);
    str += `
      <li goodsId="${item.goods_id}">
        <div class="show">
          <img src="${item.img_big_logo}" alt="">
          <div class="hot">${item.is_hot ? 'hot' : ''}</div>
          <div class="sale">${item.is_sale ? 'sale' : ''}</div>
        </div>

        <div class="info">
          <p class="title">${item.title}</p>
          <p class="price">
            <span class="currentPrice">${item.current_price}</span>
            <span class="oldPrice">${item.price}</span>
          </p>
          <button goodsId="${item.goods_id}">
            加入购物车
          </button>
        </div>
      </li>
    `
    $('.list').html(str)
  })
}

//列表页各种事件的绑定
//分类事件
$('.category').on('click', 'li', function () {
  $(this).addClass('active').siblings().removeClass('active')
  info.category = $(this).text() === '全部' ? '' : $(this).text()
  info.current = 1
  getGoodsList()
})

//筛选事件
$('.filter').on('click', 'li', function () {
  $(this).addClass('active').siblings().removeClass('active')
  info.filter = $(this).attr('type')
  info.current = 1
  getGoodsList()
})

//折扣事件
$('.sale').on('click', 'li', function () {
  $(this).addClass('active').siblings().removeClass('active')
  info.saleType = $(this).attr('type')
  info.current = 1
  getGoodsList()
})

//排序事件
$('.sort').on('click', 'li', function () {
  $(this).addClass('active').siblings().removeClass('active')
  info.sortType = $(this).attr('sortType')
  info.sortMethod = $(this).attr('sortMethod')
  getGoodsList()
})

//搜索事件
$('.search').on('input', function () {
  info.search = $(this).val()
  info.current = 1
  getGoodsList()
})

//left上一页事件
$('.left').on('click', function () {
  if ($('.left').hasClass('disable')) return
  info.current--
  getGoodsList()
})
//right下一页事件
$('.right').on('click', function () {
  if ($('.right').hasClass('disable')) return
  info.current++
  getGoodsList()
})

//select选择显示多少条数据的事件
$('select').on('change', function () {
  info.pagesize = $(this).val()
  info.current = 1
  getGoodsList()
})

//跳转事件
$('.jump').on('click', function () {
  let targetPage = $('.page').val()
  if (targetPage <= 0 || isNaN(targetPage)) targetPage = 1
  if (targetPage >= totalPage) targetPage = totalPage
  info.current = targetPage
  getGoodsList()
})

//加入购物车事件
$('.list').on('click', 'button', function (e) {
  e.stopPropagation()
  const token = window.localStorage.getItem('token')
  const id = window.localStorage.getItem('id')
  if (!token || !id) {
    window.confirm("您还没有登录, 请先登录后再加入您的购物车~")
    return
  }
  // console.log(typeof ($(this).attr('goodsId')));
  $.ajax({
    url: 'http://localhost:2332/cart/add',
    method: 'POST',
    data: { id: id, goodsId: $(this).attr('goodsId') },
    headers: { authorization: token },
    success(res) {
      // console.log(res);
      if (res.code !== 1) {
        window.alert("您还没有登录, 请先登录后再加入您的购物车~")
        return
      }
      window.alert('恭喜您, 加入购物车成功啦')
    }
  })
})

//切换到商品详情页事件
$('.list').on('click', 'li', function () {
  //本地存储goods_id的值, 给到detail.html用
  window.localStorage.setItem('goodsId', $(this).attr('goodsId'))
  window.location.href = './detail.html'
})