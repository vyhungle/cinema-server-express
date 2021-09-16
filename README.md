# Api Ciname

Api server https://server-api-cinema.herokuapp.com/ \
Api geolocation https://opencagedata.com/api \
Api location:

- get citys https://provinces.open-api.vn/api/p
- get districts https://provinces.open-api.vn/api/p/{ city code }?depth=2
- get wards https://provinces.open-api.vn/api/d/{ district code }?depth=2

## `Index`

- [Auth](#auth)
- [Cast](#cast)
- [Director](#director)
- [Producer](#producer)
- [Category](#category)
- [Nation](#nation)
- [Movie](#movie)

## `Auth`

### Modal

     {
        "_id": string,
        "email": string,
        "phoneNumber": string,
        "profile": {
              "fullname": string,
              "avatar": string,
              "dateOfBirth": string,
              "hobby": string,
              "male": boolean,
              "address": {
                   "city": string,
                  "district": string,
                  "ward": string,
                  "street": string
              }
        }
        "createdAt": string
      }

### Đăng ký

- Method post
- https://server-api-cinema.herokuapp.com/api/auth/register
- Content-Type: application/json
- body

      {
        "email": string,
        "phoneNumber": string,
        "password": string,
        "confirmPassword": string,
        "fullName": string,
        "address": {
              "city": string,
              "district": string,
              "ward": string,
              "street": string
        },
        "dateOfBirth": string (mm/dd/yyy)
      }

- res (nếu đăng ký thành công trả về values, ngược lại trả về errors)

      {
        "success": boolen,
        "message": string,

        "values": {
              "token": string,
              "user": obj User
              }
        "errors": {tên field: string...}
      }

### Đăng nhập

- Method post
- https://server-api-cinema.herokuapp.com/api/auth/login
- Content-Type: application/json
- body

      {
        "username": string(email hoặc phoneNumber),
        "password": string,
      }

- res (nếu đăng nhập thành công trả về values, ngược lại trả về errors)

      {
        "success": boolen,
        "message": string,

        "values": {
              "token": string,
              "user": obj User
              }
        "errors": {tên field: string...}
      }

### Lấy thông tin của user đăng nhập

- Method get
- https://server-api-cinema.herokuapp.com/api/auth/me
- Content-Type: application/json
- Authorization: Bearer <Token khi login hoặc register>
- res

      {
        "success": boolean,
        "message": string,
        "user": obj User
      }
      
 ## `Cast`

### Modal

     {
        "_id": string,
        "name": string,
        "dateOfBirth": string,
        "image": string,
        "joinDate": string,
        "address": string,
        "email": string,
        "phoneNumber": string,
        "introduce": string,
        "male": booleanm
        "createdAt": string
      }
      
 ### Tạo đạo diễn mới
- Method post
- https://server-api-cinema.herokuapp.com/api/cast/add
- body
           
          "name":"Craig Gillespie",
          "dateOfBirth":"9/1/1967",
          "image": "https://www.galaxycine.vn/media/c/r/craig-doc.png",
          "joinDate":"10/10/2015",
          "address":"Sydney, New South Wales, Australia",
          "phoneNumber":"0986521456",
          "email":"craig@gmail.com",
          "introduce":"",
          "male":true
     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "cast": obj cast
          }
          
  ### Lấy tất cả đạo diễn
- Method post
- https://server-api-cinema.herokuapp.com/api/cast/all     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "casts": [obj cast]
          }
          
  ### Lấy đạo diễn theo id
- Method post
- https://server-api-cinema.herokuapp.com/api/cast/:id     
- res 

          "success": boolean,
          "message": string,
          "values": {
               "cast": obj cast
          }

## `Director`

### Modal

     {
        "_id": string,
        "name": string,
        "dateOfBirth": string,
        "image": string,
        "joinDate": string,
        "address": string,
        "email": string,
        "phoneNumber": string,
        "introduce": string,
        "male": booleanm
        "createdAt": string
      }
      
 ### Tạo diễn viên mới
- Method post
- https://server-api-cinema.herokuapp.com/api/director/add
- body
           
          "name":"Craig Gillespie",
          "dateOfBirth":"9/1/1967",
          "image": "https://www.galaxycine.vn/media/c/r/craig-doc.png",
          "joinDate":"10/10/2015",
          "address":"Sydney, New South Wales, Australia",
          "phoneNumber":"0986521456",
          "email":"craig@gmail.com",
          "introduce":"",
          "male":true
     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "director": obj director
          }
          
  ### Lấy tất cả diễn viên
- Method post
- https://server-api-cinema.herokuapp.com/api/director/all     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "directors": [obj director]
          }
          
  ### Lấy diễn viên theo id
- Method post
- https://server-api-cinema.herokuapp.com/api/director/:id     
- res 

          "success": boolean,
          "message": string,
          "values": {
               "director": obj director
          }

## `Producer`
### Modal

     {
          "_id": string,
          "name": string,
          "address": string,
          "phoneNumber": string,
          ""email: string,
      }
      
      
## `Category`
### Modal

     {
          "_id": string,
          "name": string,
          "image": string,
     }

### Tạo thể loại mới
- Method post
- https://server-api-cinema.herokuapp.com/api/category/add
- body
           
          "name":"Việt Nam"
     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "category": obj category
          }
          
  ### Lấy tất cả thể loại
- Method post
- https://server-api-cinema.herokuapp.com/api/category/all     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "categories": [obj categories]
          }
          
  ### Lấy thể loại theo id
- Method post
- https://server-api-cinema.herokuapp.com/api/category/:id     
- res 

          "success": boolean,
          "message": string,
          "values": {
               "category": obj category
          }
      
## `Nation`
### Modal

     {
          "_id": string,
          "name": string,
     }

### Tạo quốc gia mới
- Method post
- https://server-api-cinema.herokuapp.com/api/nation/add
- body
           
          "name":"Việt Nam"
     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "nation": obj nation
          }
          
  ### Lấy tất cả quốc gia
- Method post
- https://server-api-cinema.herokuapp.com/api/nation/all     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "nations": [obj nations]
          }
          
  ### Lấy quốc gia theo id
- Method post
- https://server-api-cinema.herokuapp.com/api/nation/:id     
- res 

          "success": boolean,
          "message": string,
          "values": {
               "nation": obj nation
          }

## `Movie`
### Modal

     {
          "_id": string,
          "name": String,
          "moveDuration": String,
          "image": String,
          "trailer": String,
          "description": String,
          "nation": string (_id nation),
          "cast": string (_id cast)
     }

### Tạo phim mới
- Method post
- https://server-api-cinema.herokuapp.com/api/movie/add
- body
           
          "name":"CRUELLA",
          "moveDuration":"120",
          "image":"https://www.galaxycine.vn/media/2021/5/6/1200x1800_1620271790120.jpg",
          "trailer":"https://youtu.be/gmRKv7n2If8",
          "description":"Cruella lấy bối cảnh London thập niên 70, sau cuộc cách mạng văn hóa và âm nhạc. Emma Stone vào vai nhà thiết kế trẻ tuổi Estella – một cô gái trẻ tham vọng, chịu thương chịu khó nhưng lại bị đánh giá thấp trong nghề. Chẳng cam lòng, cô nàng quyết tâm tạo dựng tên tuổi trong ngành thời trang.",
          "nation":"61421264fcc0d010bc34d3d5",
          "cast":"614203ba5428a850a873bad2"
     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "movie": obj movie
          }
          
  ### Lấy tất cả phim
- Method post
- https://server-api-cinema.herokuapp.com/api/movie/all     
 - res 
 
          "success": boolean,
          "message": string,
          "values": {
               "movies": [obj movies]
          }
          
  ### Lấy phim theo id
- Method post
- https://server-api-cinema.herokuapp.com/api/movie/:id     
- res 

          "success": boolean,
          "message": string,
          "values": {
               "movie": obj movie
          }

        
        

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[dill]: https://github.com/joemccann/dillinger
[git-repo-url]: https://github.com/joemccann/dillinger.git
[john gruber]: http://daringfireball.net
[df1]: http://daringfireball.net/projects/markdown/
[markdown-it]: https://github.com/markdown-it/markdown-it
[ace editor]: http://ace.ajax.org
[node.js]: http://nodejs.org
[twitter bootstrap]: http://twitter.github.com/bootstrap/
[jquery]: http://jquery.com
[@tjholowaychuk]: http://twitter.com/tjholowaychuk
[express]: http://expressjs.com
[angularjs]: http://angularjs.org
[gulp]: http://gulpjs.com
[pldb]: https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md
[plgh]: https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md
[plgd]: https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md
[plod]: https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md
[plme]: https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md
[plga]: https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md
