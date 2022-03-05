﻿using SecurityContext = ASC.Core.SecurityContext;

namespace ASC.People.Api;

public class RemoveUserDataController : ApiControllerBase
{
    private Tenant Tenant => _apiContext.Tenant;

    private readonly PermissionContext _permissionContext;
    private readonly UserManager _userManager;
    private readonly QueueWorkerRemove _queueWorkerRemove;
    private readonly SecurityContext _securityContext;
    private readonly StudioNotifyService _studioNotifyService;
    private readonly MessageService _messageService;
    private readonly AuthContext _authContext;
    private readonly ApiContext _apiContext;

    public RemoveUserDataController(
        PermissionContext permissionContext,
        UserManager userManager,
        QueueWorkerRemove queueWorkerRemove,
        SecurityContext securityContext,
        StudioNotifyService studioNotifyService,
        MessageService messageService,
        AuthContext authContext,
        ApiContext apiContext)
    {
        _permissionContext = permissionContext;
        _userManager = userManager;
        _queueWorkerRemove = queueWorkerRemove;
        _securityContext = securityContext;
        _studioNotifyService = studioNotifyService;
        _messageService = messageService;
        _authContext = authContext;
        _apiContext = apiContext;
    }

    [Read(@"remove/progress")]
    public RemoveProgressItem GetRemoveProgress(Guid userId)
{
        _permissionContext.DemandPermissions(Constants.Action_EditUser);

        return _queueWorkerRemove.GetProgressItemStatus(Tenant.Id, userId);
    }

    [Update("self/delete")]
    public object SendInstructionsToDelete()
    {
        var user = _userManager.GetUsers(_securityContext.CurrentAccount.ID);

        if (user.IsLDAP())
        {
            throw new SecurityException();
        }

        _studioNotifyService.SendMsgProfileDeletion(user);
        _messageService.Send(MessageAction.UserSentDeleteInstructions);

        return string.Format(Resource.SuccessfullySentNotificationDeleteUserInfoMessage, "<b>" + user.Email + "</b>");
    }

    [Create(@"remove/start")]
    public RemoveProgressItem StartRemoveFromBody([FromBody] TerminateRequestDto model)
    {
        return StartRemove(model);
    }

    [Create(@"remove/start")]
    [Consumes("application/x-www-form-urlencoded")]
    public RemoveProgressItem StartRemoveFromForm([FromForm] TerminateRequestDto model)
    {
        return StartRemove(model);
    }

    [Update(@"remove/terminate")]
    public void TerminateRemoveFromBody([FromBody] TerminateRequestDto model)
    {
        TerminateRemove(model);
    }

    [Update(@"remove/terminate")]
    [Consumes("application/x-www-form-urlencoded")]
    public void TerminateRemoveFromForm([FromForm] TerminateRequestDto model)
    {
        TerminateRemove(model);
    }

    private void TerminateRemove(TerminateRequestDto model)
    {
        _permissionContext.DemandPermissions(Constants.Action_EditUser);

        _queueWorkerRemove.Terminate(Tenant.Id, model.UserId);
    }

    private RemoveProgressItem StartRemove(TerminateRequestDto model)
    {
        _permissionContext.DemandPermissions(Constants.Action_EditUser);

        var user = _userManager.GetUsers(model.UserId);

        if (user == null || user.Id == Constants.LostUser.Id)
        {
            throw new ArgumentException("User with id = " + model.UserId + " not found");
        }

        if (user.IsOwner(Tenant) || user.IsMe(_authContext) || user.Status != EmployeeStatus.Terminated)
        {
            throw new ArgumentException("Can not delete user with id = " + model.UserId);
        }

        return _queueWorkerRemove.Start(Tenant.Id, user, _securityContext.CurrentAccount.ID, true);
    }
}
