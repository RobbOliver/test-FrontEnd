import axios from "axios";

const apiKey = "coinranking89558dc27d1f9922f854dceb4bca30716212cb126a46b2da"

const api = axios.create({
    baseURL: "https://api.coinranking.com/v2",
    headers: {
        'x-access-token': apiKey
    }
});

export default api;