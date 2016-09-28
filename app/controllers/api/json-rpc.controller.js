import JsonRPCFacade from '../../utils/json-rpc/json-rpc-facade';

module.exports = class JsonRPCController {

    static handleJsonRPC(req, res) {
        let jsonRPCFacade = new JsonRPCFacade(req);
        let response = jsonRPCFacade.generateResponse();

        function jsonSuccessCB(result) { res.json(result); }
        function jsonFailCB(err) { res.json({ "message": err.message })}

        if(Array.isArray(response)) Promise.all(response).then(jsonSuccessCB).catch(jsonFailCB);
        else response.then(jsonSuccessCB).catch(jsonFailCB);   
    }
    
};

