import axios from "axios";
import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster({ position: "top-right" });

export default function (to, from, next) {
    var token = localStorage.getItem('admin_login');
    axios
        .get('http://127.0.0.1:8000/api/admin/check-token', {
            headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
            if (res.data.status) {
                localStorage.setItem('ho_va_ten', res.data.ho_ten);
                next();
            } else {
                toaster.error(res.data.message);
                next('/admin/dang-nhap');
            }
        })
        .catch(() => {
            toaster.error("Lỗi kết nối đến server!");
            next("/admin/dang-nhap");
        });
}
