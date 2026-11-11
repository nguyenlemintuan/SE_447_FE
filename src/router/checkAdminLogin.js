import axios from "axios";
import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster({ position: "top-right" });
const API = "http://127.0.0.1:8000/api";

function loginLocation(to) {
    return { path: "/dang-nhap", query: { redirect: to.fullPath } };
}

export default function (to, from, next) {
    const token = localStorage.getItem("admin_login");
    if (!token) return next(loginLocation(to));

    axios
        .get(`${API}/admin/check-token`, {
            headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
            if (res.data.status) {
                localStorage.setItem("ho_va_ten", res.data.ho_ten);
                next();
            } else {
                localStorage.removeItem("admin_login");
                toaster.error(res.data.message || "Phiên đăng nhập đã hết hạn.");
                next(loginLocation(to));
            }
        })
        .catch(() => {
            toaster.error("Lỗi kết nối đến server!");
            next(loginLocation(to));
        });
}
