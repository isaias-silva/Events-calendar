import { GlobalResponse } from "./global.responses.interface"

export interface JwtResponse extends GlobalResponse {
    message: string
    token: string
}