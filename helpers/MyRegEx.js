class MyRegEx {
  static convertUTF8(string) {
    const newString = string.normalize().toLowerCase()
      .replace(/:/g, '')
      .replace(/"/g, '')
      .replace(/'/g, '')
      .replace(/!/g, '')
      .replace(/,/g, '')
      .replace(/\(|\)/g, '')
      .replace(/\[|\]/g, '')
      .replace(/ - /g, '-')
      .replace(/ /g, '-')
      .replace(/ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
      .replace(/á/g, 'a').replace(/à/g, 'a').replace(/ả/g, 'a').replace(/ã/g, 'a').replace(/ạ/g, 'a')
      .replace(/ê|ế|ề|ể|ễ|ệ/g, 'e')
      .replace(/é/g, 'e').replace(/è/g, 'e').replace(/ẽ/g, 'e').replace(/ẹ/g, 'e').replace(/ẻ/g, 'e')
      .replace(/í/g, 'i').replace(/ì/g, 'i').replace(/ỉ/g, 'i').replace(/ĩ/g, 'i').replace(/ị/g, 'i')
      .replace(/ư|ứ|ừ|ử|ữ|ự/g, 'u')
      .replace(/ú/g, 'u').replace(/ù/g, 'u').replace(/ủ/g, 'u').replace(/ũ/g, 'u').replace(/ụ/g, 'u')
      .replace(/ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o')
      .replace(/ó/g, 'o').replace(/ò/g, 'o').replace(/ỏ/g, 'o').replace(/õ/g, 'o').replace(/ọ/g, 'o')
      .replace(/đ/g, 'd')
      .replace(/ý/g, 'y').replace(/ỳ/g, 'y').replace(/ỷ/g, 'y').replace(/ỹ/g, 'y').replace(/ỵ/g, 'y')

    console.log(newString);
    return (newString);
  }
}

module.exports = MyRegEx;