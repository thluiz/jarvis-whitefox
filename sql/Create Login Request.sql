create table LoginRequest (
	LoginRequestId int Identity(1, 1) Primary Key not null, 
	ProviderId int not null,
	ProviderKey varchar(128) not null,
	UserId int not null,
	Details varchar(max)
)

GO

alter table LoginRequest 
	add TemporaryProviderKey varchar(128) not null

GO

create procedure CreateLoginRequest(@email varchar(80), @token varchar(128), @temporaryToken varchar(128), @details varchar(max))
as 
begin 
	declare @userId int = (select userid from users where email = @email)

	insert into LoginRequest (userId, ProviderId, ProviderKey, TemporaryProviderKey, Details)
	values (@userId, 2, @token, @temporaryToken, @details)

end 





