alter procedure ApproveLoginRequest(@temporaryToken varchar(128)) 
as
begin 
	declare @providerId int, @providerKey varchar(128), @userId int, 
		@details varchar(max), @name varchar(200)
	
	select @providerId = providerId, @providerKey = providerKey, 
		@userId = u.userId, @details = details, @name = u.[name]
	from LoginRequest l
		join users u on u.userid = l.userid 
	where temporaryProviderKey = @temporaryToken

	insert into userlogins(ProviderKey, userid, providerid)
	values (@providerKey, @userId, @providerId)

	delete from LoginRequest
	where temporaryProviderKey = @temporaryToken

	if(@userId is null)
	begin
		select 0 success, 'Usuario não encontrado' [Message]
		for json path
	end
	else 
	begin			 
		select 1 success, @details [Address],  
		@name [Name], @providerKey Token
		for json path
	end

end

go
