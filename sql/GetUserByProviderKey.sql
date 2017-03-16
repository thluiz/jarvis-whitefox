alter procedure GetUserData(@securityId int)
as
begin 

	select userId id, [name], 
	(select p.Name, p.ProjectId Id  
	 from project p  
	  join projectUser pu on pu.projectId = p.projectId      
	 where pu.userid = u.userId  
	  and p.active = 1
	  for json path) projects
	from [user] u where securityId = @securityId    
	for json path

end

GO
select * from [user]
GetUserData 3
--sp_helptext GetUserProjects