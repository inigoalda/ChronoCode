package fr.epita.assistants.myide.domain.entity.maven;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class TestMavenFeature implements Feature {

    public TestMavenFeature(){}

    @Override
    public ExecutionReport execute(Project project, Object... params) {
            ProcessBuilder procBuilder = new ProcessBuilder();
            List<String> args = new ArrayList<String>();
            args.add("mvn");
            args.add("test");
        for (Object s : params){
            args.add(s.toString());
        }
            procBuilder.command(args);
        procBuilder.directory(project.getRootNode().getPath().toFile());
        try {
            // redirect output of subprocess to logfile
/*
            File log = new File("/home/kali/Desktop/log.txt");
            procBuilder.redirectErrorStream(true);
            procBuilder.redirectOutput(ProcessBuilder.Redirect.appendTo(log));
*/
            Logger.log("Execute Maven command: " + args);
            Process proc = procBuilder.start();
            if (proc.waitFor() != 0) {
                return () -> false;
            }
            return () -> true;
        } catch (IOException e) {
            return () -> false;
        } catch (InterruptedException e) {
            return () -> false;
        }
    }


    @Override
    public Type type() {
        return Mandatory.Features.Maven.TEST;
    }
}
