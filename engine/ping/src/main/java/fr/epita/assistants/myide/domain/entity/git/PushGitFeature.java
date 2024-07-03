package fr.epita.assistants.myide.domain.entity.git;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.domain.entity.report.GitFeatureReport;
import fr.epita.assistants.myide.utils.Logger;
import org.eclipse.jgit.api.CommitCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.Status;
import org.eclipse.jgit.api.TransportConfigCallback;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.NoFilepatternException;
import org.eclipse.jgit.errors.RepositoryNotFoundException;
import org.eclipse.jgit.lib.PersonIdent;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;
import org.eclipse.jgit.transport.PushResult;
import org.eclipse.jgit.transport.RemoteRefUpdate;
import org.eclipse.jgit.transport.SshTransport;
import org.eclipse.jgit.transport.sshd.SshdSessionFactory;
import org.eclipse.jgit.util.FS;

import java.io.File;
import java.io.IOException;

public class PushGitFeature implements Feature {

    public PushGitFeature(){}

    @Override
    public ExecutionReport execute(Project project, Object... params) {
        File repoDir = project.getRootNode().getPath().toFile();

        SshdSessionFactory sshdSessionFactory = new SshdSessionFactory();

        TransportConfigCallback transportConfigCallback = transport -> {
            if (transport instanceof SshTransport) {
                SshTransport sshTransport = (SshTransport) transport;
                sshTransport.setSshSessionFactory(sshdSessionFactory);
            }
        };

        try (Git git = Git.open(repoDir, FS.DETECTED)){
            Iterable<PushResult> pushResults = git.push().setTransportConfigCallback(transportConfigCallback).call();
            for (PushResult pushResult : pushResults) {
                for (RemoteRefUpdate update : pushResult.getRemoteUpdates()) {
                    switch (update.getStatus()) {
                        case UP_TO_DATE:
                            Logger.logError("Push FAILED: Already up to date.");
                            return new GitFeatureReport(null, false);
                        case OK:
                            Logger.log("Push done on the project");
                            break;
                        default:
                            Logger.logError("Push failed: " + update.getStatus());
                            return new GitFeatureReport(null, false);
                    }
                }
            }
            Status status = git.status().call();
            return new GitFeatureReport(status, true);
        } catch (RepositoryNotFoundException e) {
            Logger.logError("Le dépôt n'a pas été trouvé au chemin spécifié.");
        } catch (IOException e) {
            Logger.logError("Une erreur d'I/O est survenue.");
        } catch (NoFilepatternException e) {
            throw new RuntimeException(e);
        } catch (GitAPIException e) {
            Logger.logError("Une erreur Git est survenue dans la commande Push.");
        }
        return new GitFeatureReport(null, false);
    }


    @Override
    public Type type() {
        return Mandatory.Features.Git.PUSH;
    }
}
