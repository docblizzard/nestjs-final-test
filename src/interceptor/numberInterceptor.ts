
@Injectable
export class numberValidatorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const userid = request.params.userid;
    
        if (!/^\d+$/.test(userid)) {
            throw new BadRequestException('Invalid userid. Userid must be a number.');
        }
    
        return next.handle().pipe(
            catchError(error => {
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw error;
            }),
        );
    }
}