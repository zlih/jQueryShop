const token = window.localStorage.getItem('token')
const id = window.localStorage.getItem('id')
// console.log(token, id);
if (!token || !id) {
  window.location.href = './login.html'
} else {
  getCartList()
}

function getCartList() {
  $.ajax({
    url: 'http://localhost:2332/cart/list',
    method: 'GET',
    data: { id },
    headers: { authorization: token },
    success(res) {
      // console.log(res);
      if (res.code !== 1) {
        window.location.href = './login.html'
        return
      }
      bindHtml(res)
    }
  })
}

function bindHtml(res) {
  // console.log(res.cart.length);
  if (!res.cart.length) {
    $('.empty').addClass('active')
    $('.list').removeClass('active')
    // return
  }

  // 代码来到这里, 说明购物车是有数据的
  // 首先要统计一些数字
  // 一共有多少个选中的
  // 一共有多少种商品(共计 ? 件商品)
  // 总价是多少(共计 ￥ ?)
  let selectNum = 0, totalNum = 0, totalPrice = 0
  res.cart.forEach(item => {
    // console.log(item);
    if ( item.is_select ) {
      selectNum ++;
      totalNum += item.cart_number;
      totalPrice += item.current_price * item.cart_number
    }
  })

  // console.log(res.cart);
  let str = `
    <div class="top">
      全选: <input class="selectAll" type="checkbox" ${ selectNum === res.cart.length ? 'checked' : ''}>
    </div>
    <ul class="center">
  `
  res.cart.forEach(item => {
    // console.log(item);
    str += `
      <li>
        <div class="select">
          <input type="checkbox" goodsId = ${ item.goods_id } ${ item.is_select ? 'checked' : ''}>
        </div>
        <div class="show">
          <img src="${ item.img_small_logo }" alt="">
        </div>
        <div class="title">${ item.title }</div>
        <div class="price">￥ ${ item.current_price }</div>
        <div class="number">
          <button class="sub" goodsId = ${ item.goods_id }>-</button>
          <input type="text" value="${ item.cart_number }">
          <button class="add" goodsId = ${ item.goods_id }>+</button>
        </div>
        <div class="subPrice">￥ ${ (item.cart_number * item.current_price).toFixed(2) }</div>
        <div class="destroy">
          <button class="del" goodsId = ${ item.goods_id }>删除</button>
        </div>
      </li>
    `
  })
  str+=`
    </ul>
    <div class="bottom">
      <p>
        共计<span>${ totalNum }</span>件商品
      </p>
      <div class="btns">
        <button class="clear">清除购物车</button>
        <button class="clear_selected" ${ selectNum === 0 ? 'disabled' : ''}>删除已选中</button>
        <button class="pay" ${ selectNum === 0 ? 'disabled' : ''}>去支付</button>
      </div>
      <p>
        共计 ￥ <span>${ totalPrice.toFixed(2) }</span>
      </p>
    </div>
  `
  $('.list').html(str)
}

//各种事件
//修改单一商品选中事件, 参数要id和goodsId
$('.list').on('click', '.center .select input', function () {
  // console.log($(this).attr('goodsId'));
  $.ajax({
    url:'http://localhost:2332/cart/select',
    method: 'POST',
    data: {id: id, goodsId: $(this).attr('goodsId')},
    headers: {authorization: token},
  })
  getCartList()
})

//修改单一商品数量增加/减少, 参数需要id, goodsId,number
$('.list').on('click', '.center .number .add', function () {
  // console.log('数量增加啦');
  $.ajax({
    url: 'http://localhost:2332/cart/number',
    method: 'POST',
    data: {id: id, goodsId: $(this).attr('goodsId'), number: $(this).prev().val() - 0 + 1},
    headers: {authorization: token}
  })
  getCartList()
})
$('.list').on('click', '.center .number .sub', function () {
  const number = $(this).next().val() - 0;
  if ( number <= 1 ) return
  // console.log('数量增加啦');
  $.ajax({
    url: 'http://localhost:2332/cart/number',
    method: 'POST',
    data: {id: id, goodsId: $(this).attr('goodsId'), number: $(this).next().val() - 0 - 1},
    headers: {authorization: token}
  })
  getCartList()
})

//删除单一商品, 参数需要id, goodsId
$('.list').on('click', '.center .destroy .del', function () {
  $.ajax({
    url: 'http://localhost:2332/cart/remove',
    method: 'GET',
    data: {id: id, goodsId: $(this).attr('goodsId')},
    headers: {authorization: token}
  })
  getCartList()
})

//全选事件, 参数需要id, type(1或者0)
$('.list').on('click', '.top .selectAll', function () {
  const type = $('.selectAll').prop('checked') ? 1 : 0
  // console.log(type);
  $.ajax({
    url: 'http://localhost:2332/cart/select/all',
    method: 'POST',
    data: {id: id, type: type},
    headers: {authorization: token}
  })
  getCartList()
})

//清空购物车事件, 参数需要id
$('.list').on('click', '.clear', function () {
  // console.log("我要清空购物车啦");
  $.ajax({
    url: 'http://localhost:2332/cart/clear',
    method: 'GET',
    data: {id: id},
    headers: {authorization: token}
  })
  getCartList()
})

//删除已选中事件, 参数需要id
$('.list').on('click', '.clear_selected', function () {
  // console.log("我要删除已选中的商品啦");
  $.ajax({
    url: 'http://localhost:2332/cart/remove/select',
    method: 'GET',
    data: {id: id},
    headers: {authorization: token}
  })
  getCartList()
})

//去支付事件, 参数需要id
$('.list').on('click', '.pay', function () {
  console.log("我要去支付啦");
  $.ajax({
    url: 'http://localhost:2332/cart/pay',
    method: 'POST',
    data: {id: id},
    headers: {authorization: token},
    success (res) {
      console.log(res);
      //由于练习使用的是本地服务器, 未写支付接口哈~~~
    }
  })
  getCartList()
})