# api cinema
Link server [https://server-api-cinema.herokuapp.com/](https://server-api-cinema.herokuapp.com/)\
API location https://thongtindoanhnghiep.co/rest-api




## `Auth`
### Đăng ký

-Method post \
-https://server-api-cinema.herokuapp.com/api/auth/register \
-Content-Type: application/json\
-body\
{\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"email": string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"phoneNumber" : string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"password": string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"confirmPassword": string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fullName": string,\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"address":{\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"city": string,\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"district": string,\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ward": string,\
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"street": string\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"dateOfBirth": string (mm/dd/yyy)\
}\
-res (nếu đăng ký thành công trả về values, ngược lại trả về errors)\
{ \
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"success": boolen,\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message": string,
 
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"values": {\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"token": string,\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"user": obj User\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"errors": {tên field: string...}\
}

### Đăng nhập

-Method post \
-https://server-api-cinema.herokuapp.com/api/auth/login \
-Content-Type: application/json\
-body\
{\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"username": string(email hoặc phoneNumber),\
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"password" : string,\
}\
-res (nếu đăng nhập thành công trả về values, ngược lại trả về errors)\
{ \
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"success": boolean,\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message": string,
 
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"values": {\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"token": string,\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"user": obj User\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"errors": {tên field: string...}\
}


### Lấy thông tin của user đăng nhập
-Method get \
-https://server-api-cinema.herokuapp.com/api/auth/me \
-Content-Type: application/json\
-Authorization: Bearer <Token khi login hoặc register>\
-res \
{ \
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"success": boolean,\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message": string,\
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"user": obj User\
}
