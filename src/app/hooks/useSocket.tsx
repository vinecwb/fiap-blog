import { socket } from "@/pages/api/socket";
import { useEffect, useState } from "react";

export const useSocket = (userId: number) => {
    const[socketInstance, setSocketInstance] = useState(
        socket(
        {
            userId,

        })
    )
    const [isConnected, setIsConnected ] = useState(socketInstance.connected)
    useEffect(() => {
        function onConnect(){
            console.log('Conectado ao servidor Socket.IO')
            console.log('Instancia: ', socketInstance)
            setIsConnected(true);
        }
        function onDisconnect(){
            console.log('Desconectado do servidor Socket.IO')
            setIsConnected(false);
        }
        socketInstance.on("connect", onConnect)
        socketInstance.on("disconnect", onDisconnect)
        return() =>{
            socketInstance.off("connect", onConnect)
            socketInstance.off("disconnect", onDisconnect)

        }
    }, [socketInstance, userId])
    return { socketInstance, isConnected}
};

