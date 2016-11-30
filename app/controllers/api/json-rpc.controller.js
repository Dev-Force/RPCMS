import Promise from 'bluebird';
import JsonRPCFacade from '../../utils/json-rpc/json-rpc-facade';

/**
 * 
 * 
 * @class JsonRPCController
 */
export default class JsonRPCController {

    /**
     * Handles any JsonRPC request
     * 
     * @static
     * @param {any} req
     * @param {any} res
     */
    static handleJsonRPC(req, res) { 
        let jsonRPCFacade = new JsonRPCFacade(req);
        let response = jsonRPCFacade.generateResponse();

        /**
         * callback when a promise is successful
         * 
         * @param {any} result
         */
        function jsonSuccessCB(result) { res.json(result); }

        /**
         * callback when a promise failed
         * 
         * @param {any} err
         */
        function jsonFailCB(err) { res.json({ "message": err.message })}

        if(Array.isArray(response)) Promise.all(response).then(jsonSuccessCB).catch(jsonFailCB);
        else response.then(jsonSuccessCB).catch(jsonFailCB);   
    }
    
}
