
import axios from "axios";
import { Api } from "./env";


const CallApi = axios.create({
    baseURL: Api,
    timeout: 10000,

  });

export default CallApi