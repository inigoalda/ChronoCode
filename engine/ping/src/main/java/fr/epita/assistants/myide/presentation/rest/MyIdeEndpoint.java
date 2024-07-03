package fr.epita.assistants.myide.presentation.rest;

import fr.epita.assistants.MyIde;
import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.ProjectImpl;
import fr.epita.assistants.myide.domain.entity.any.LSAnyFeature;
import fr.epita.assistants.myide.domain.entity.report.*;
import fr.epita.assistants.myide.domain.service.ProjectServiceImpl;
import fr.epita.assistants.myide.presentation.rest.request.*;
import fr.epita.assistants.myide.presentation.rest.response.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import fr.epita.assistants.myide.utils.Logger;

import java.io.IOException;
import java.util.Optional;

@Path("/api")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MyIdeEndpoint {

    ProjectServiceImpl projectService = (ProjectServiceImpl)MyIde.init(new MyIde.Configuration(java.nio.file.Path.of("here"), java.nio.file.Path.of("temp")));

    @GET @Path("/hello")
    public Response helloWorld()
    {
        Logger.log("Saying hello !");
        return Response.ok("Hello World !").build();
    }

    @POST @Path("/open/project")
    public Response openProject(PathRequest req){
        if (req == null || req.path == null || req.path.isEmpty()){
            Logger.logError("Bad Request");
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Logger.log("Open Project: " + req.path);
        try {
            ProjectImpl project = (ProjectImpl) projectService.load(java.nio.file.Path.of(req.path));
            return Response.ok(new FolderResponse(project.getRootNode())).build();
        } catch (Exception e) {
            System.out.println(e);
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    @POST @Path("/open/file")
    public Response openFile(PathRequest req)
    {
        if (req == null || req.path == null || req.path.isEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Logger.log(req.toString());
        try {
            ProjectImpl project = (ProjectImpl) projectService.load(java.nio.file.Path.of(req.path));
            return Response.ok(new FileResponse(project)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    @POST @Path("/create/file")
    public Response createFile(CreateRequest req)
    {
        if (req == null || req.path == null || req.path.isEmpty() || req.content == null){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Logger.log(req.toString());
        if (projectService.createFile(java.nio.file.Path.of(req.path), req.content)){
            return Response.ok("createFile").build();
        }
        Logger.logError("File already exists endpoint");
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @POST @Path("/create/folder")
    public Response createFolder(PathRequest req)
    {
        if (req == null || req.path == null || req.path.isEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Logger.log(req.toString());
        if (projectService.createFolder(java.nio.file.Path.of(req.path))){
            return Response.ok("createFolder").build();
        }
        Logger.logError("Folder already exists endpoint");
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @POST @Path("/delete/file")
    public Response deleteFile(PathRequest req)
    {
        if (req == null || req.path == null || req.path.isEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Logger.log(req.toString());
        if (projectService.deleteFile(java.nio.file.Path.of(req.path))){
            return Response.ok("deleteFile").build();
        }
        Logger.logError("File does not exists endpoint");
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @POST @Path("/delete/folder")
    public Response deleteFolder(PathRequest req)
    {
        if (req == null || req.path == null || req.path.isEmpty()){
            Logger.logError("Bad request");
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Logger.log(req.toString());
        if (projectService.deleteFolder(java.nio.file.Path.of(req.path))){
            return Response.ok("deleteFolder").build();
        }
        Logger.logError("Folder does not exists endpoint");
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @POST @Path ("/ls")
    public Response ls(ExecRequest req){
        if (checkEmptiness(req)) return Response.status(Response.Status.BAD_REQUEST).entity("Bad arguments").build();
        try
        {
            Optional<Feature.Type> f = projectService.getFeature(req.feature);
            if (f.isEmpty())
            {
                throw new IllegalArgumentException();
            }
            LSAnyFeature l = new LSAnyFeature();
            LSFeatureReport executionReport = (LSFeatureReport) l.execute(req.params.toArray(new String[req.params.size()]));
            if (executionReport.isSuccess()) {
                return Response.ok(new LSResponse(executionReport.getFolders(), executionReport.getFiles())).build();
            }

        }
        catch (IllegalArgumentException e)
        {
            Logger.logError("Not a valid Argument");
        }
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Execution fail")
                .build();
    }

    private boolean checkEmptiness(ExecRequest req) {
        Logger.log(req.toString());
        if (req.feature == null || req.feature.isEmpty() || req.params == null || req.project == null || req.project.isEmpty()){
            Logger.logError("Bad request");
            return true;
        }
        return false;
    }

    @POST @Path("/execFeature")
    public Response execFeature(ExecRequest req)
    {
        if (checkEmptiness(req)) return Response.status(Response.Status.BAD_REQUEST).entity("Bad arguments").build();
        try
        {
            Optional<Feature.Type> f = projectService.getFeature(req.feature);
            if (f.isEmpty())
            {
                throw new IllegalArgumentException();
            }
            Feature.ExecutionReport executionReport = projectService.execute(projectService.getProject(), f.get(),req.params.toArray(new String[req.params.size()]));
            if (executionReport instanceof SearchFeatureReport){
                if (executionReport.isSuccess()) {
                    SearchFeatureReport a = (SearchFeatureReport) executionReport;
                    return Response.ok(new SearchResponse(a.getResults())).build();
                }
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("The SEARCH did not find the word \"" + req.params.toArray(new String[req.params.size()])[0] + "\" in the project")
                        .build();
            }
            if (executionReport instanceof GitFeatureReport){
                if (executionReport.isSuccess()) {
                    return Response.ok(((GitFeatureReport) executionReport).getStatusResult()).build();
                }
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("The SEARCH did not find the word \"" + req.params.toArray(new String[req.params.size()])[0] + "\" in the project")
                        .build();
            }
            if (executionReport.isSuccess()) {
                return Response.ok("Feature ok !").build();
            }
        }
        catch (IllegalArgumentException e)
        {
            Logger.logError("Not a valid Argument");
        }
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("Execution fail")
                .build();
    }

    @POST @Path("/move")
    public Response move(MoveRequest req)
    {
        if (req == null || req.src == null || req.src.isEmpty()
                || req.dst == null || req.dst.isEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Logger.log(req.toString());
        if (projectService.move(java.nio.file.Path.of(req.src), java.nio.file.Path.of(req.dst))){
            return Response.ok("move").build();
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    }

    @POST @Path("/update")
    public Response update(UpdateRequest req)
    {
        if (req == null || req.path == null || req.path.isEmpty()
                || req.from == null || req.to == null
                || req.content == null || req.content.isEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        Logger.log(req.toString());
        if (((ProjectServiceImpl)projectService).update(java.nio.file.Path.of(req.path), req.from, req.to, req.content)){
            return Response.ok("update").build();
        }
        Logger.logError("Folder can not be updated endpoint");
        return Response.status(Response.Status.BAD_REQUEST).build();
    }
}
