import axiosClient from "./AxiosClient";

const paymentApi = {
    pay: (id) => {
        return axiosClient.post(`payment/${id}`)
    },
    walletInfo: () => {
        return axiosClient.get('wallet/info')
    }
}

export default paymentApi