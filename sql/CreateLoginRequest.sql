alter procedure CreateLoginRequest(@email varchar(80), @token varchar(128), @temporaryToken varchar(128), @details varchar(max))  
as   
begin   
	declare @userId int = (select userid from users where email = @email)  
  
	if(@userId is null) 
	begin
		select cast(0 as bit) success, 'Usuário não encontrato' [message]
		for json path
	end
	else
	begin
		insert into LoginRequest (userId, ProviderId, ProviderKey, TemporaryProviderKey, Details)  
			values (@userId, 2, @token, @temporaryToken, @details)  

		select cast(1 as bit) success, 
			scope_identity() loginRequestId, @userId userId
		for json path
	end		     
end 
