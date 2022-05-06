const goodsId = window.localStorage.getItem('goodsId')
// console.log(goodsId);
if ( !goodsId ) window.location.href = './list.html'

getInfo()
function getInfo() {
  $.get('http://localhost:2332/goods/item', { id : goodsId }, res => {
    console.log(res)
    $('.show > img').prop( 'src', res.info.img_big_logo )
    $('.info > .title').text( res.info.title )
    $('.info > .price').text( "¥ " + res.info.current_price )
  })
}

//加入购物车事件
$('.content').on('click', 'button', function (e) {
  e.stopPropagation()
  // console.log('我要去加入购物车啦');
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
    data: { id: id, goodsId: goodsId },
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

/* $('.content').on('click', function () {
  console.log('我不阻止事件冒泡, 我想看看我点击加入购物车时会不会出现这个信息');
}) */