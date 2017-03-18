alter procedure SearchItemBacklog(@userId int, @maxItens int, @title varchar(180))
as
begin 

	declare @total int = (select count(1)
							from itembacklog i
								join project p on i.projectid = p.projectid
								join ProjectUser pu on pu.projectId = p.projectId
							where pu.userid = @userId 
								and title like '%' + @title + '%')
	
	select @total total, (
		select top (@maxItens)
			p.Name + ' - ' + i.title name, i.itembacklogId id
		from itembacklog i
			join project p on i.projectid = p.projectid
			join ProjectUser pu on pu.projectId = p.projectId
		where pu.userid = @userId 
			and title like '%' + @title + '%'
		order by i.itembacklogId desc
		for json path
	) items 
	for json path

end

GO

SearchItemBacklog 3, 3, 'cartão bpp'
