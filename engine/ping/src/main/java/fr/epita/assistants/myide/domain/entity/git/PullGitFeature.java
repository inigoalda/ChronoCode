package fr.epita.assistants.myide.domain.entity.git;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.entity.report.GitFeatureReport;
import fr.epita.assistants.myide.utils.Logger;
import org.eclipse.jgit.api.*;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.NoFilepatternException;
import org.eclipse.jgit.errors.RepositoryNotFoundException;
import org.eclipse.jgit.transport.SshTransport;
import org.eclipse.jgit.transport.sshd.SshdSessionFactory;
import org.eclipse.jgit.util.FS;

import org.eclipse.jgit.api.Git;

import java.io.File;
import java.io.IOException;

public class PullGitFeature implements Feature {

    public PullGitFeature(){}

    @Override
    public GitFeatureReport execute(Project project, Object... params) {
        File repoDir = project.getRootNode().getPath().toFile();

        SshdSessionFactory sshdSessionFactory = new SshdSessionFactory();

        TransportConfigCallback transportConfigCallback = transport -> {
            if (transport instanceof SshTransport) {
                SshTransport sshTransport = (SshTransport) transport;
                sshTransport.setSshSessionFactory(sshdSessionFactory);
            }
        };

        try (Git git = Git.open(repoDir, FS.DETECTED)){


            PullCommand pull = git.pull();
            pull.setFastForward(MergeCommand.FastForwardMode.FF);
            pull.setTransportConfigCallback(transportConfigCallback);
            pull.call();

            Logger.log("Pull done on project");
            Status status = git.status().call();
            return new GitFeatureReport(status, true);
        } catch (RepositoryNotFoundException e) {
            Logger.logError("Le dépôt n'a pas été trouvé au chemin spécifié.");
        } catch (IOException e) {
            Logger.logError("Une erreur d'I/O est survenue.");
        } catch (NoFilepatternException e) {
            throw new RuntimeException(e);
        } catch (GitAPIException e) {
            System.out.println(e.getMessage());
            Logger.logError("Une erreur Git est survenue dans la commande Pull.");
        }
        return new GitFeatureReport(null, false);
    }


    @Override
    public Type type() {
        return Mandatory.Features.Git.PULL;
    }
}
