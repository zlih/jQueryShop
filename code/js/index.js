const token = window.localStorage.getItem('token')
const id = window.localStorage.getItem('id')
// console.log(token, id);

if (!token || !id) {
  $('.off').addClass('active')
  $('.on').removeClass('active')
} else {
  getInfo()
}

function getInfo() {
  $.ajax({
    url: 'http://localhost:2332/users/info',
    method: 'GET',
    data: { id: id },
    headers: { authorization: token },
    success(res) {
      // console.log(res);
      if (res.code !== 1) {
        $('.off').addClass('active')
        $('.on').removeClass('active')
        return
      } else {
        // console.log(res.info.nickname);
        // 在下面, 由于on和off是class选择器忘记加点了, 一直在找出错的地方
        $('.on').addClass('active').find('span').text(res.info.nickname)
        $('.off').removeClass('active')
      }
    }
  })
}

$('button.self').on('click', function () {
  window.location.href = './self.html'
})

$('button.logout').on('click', function () {
  $.get('http://localhost:2332/users/logout', {id:id}, res => {
    // console.log(res)
    window.location.reload()
  })
})