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
     
  
 if(@userId is null)  
 begin  
  select cast(0 as bit) success, 'Usuario não encontrado' [Message]  
  for json path  
 end  
 else   
 begin      
	if(not exists(select 1 from userlogins 
					where providerkey = @providerkey
						and userid = @userid
						and providerId = @providerId))
		insert into userlogins(ProviderKey, userid, providerid, LoginData)  
		values (@providerKey, @userId, @providerId, @details)  

	delete from LoginRequest  
	where temporaryProviderKey = @temporaryToken  

	select cast(1 as bit) success, @providerKey providerKey, @userId userId, 
		@details details, @name [name]
	for json path
 end  
  
end  

GO




  
