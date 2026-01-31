import { redirect } from "react-router-dom";
import { message } from "antd";

const loginGuard = () => {
    const token = localStorage.getItem('AUTH_TOKEN')

    if (!token) {
        message.warning('Anda harus login dulu!')
        throw redirect('/masuk')
    }

    return null
}

export default loginGuard