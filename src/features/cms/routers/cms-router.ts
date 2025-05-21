import { Router, Request, Response} from "express";
import { UserRepository } from "../../user/repository/user-repository";

export class CmsRouter{
    router: Router;
    private userRepository: UserRepository;

    constructor(){
        this.router = Router();
        this.userRepository = new UserRepository();

        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post('/login', this.login.bind(this));
    }

    private login(req: Request, res: Response){
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).send({'success': false, 'data': 'INVALID_REQUEST_PARAMETERS'});
            return;
        }

        const user = this.userRepository.signIn(email, password);

        if(user == null){
            res.status(200).send({'success': false, 'data': 'INVALID_USER_CREDENTIALS'});
        }else{
            res.status(200).send({'success': true, 'data': user.toJson()});
        }
    }
}

const cmsRouterInstance = new CmsRouter();
export default cmsRouterInstance.router;