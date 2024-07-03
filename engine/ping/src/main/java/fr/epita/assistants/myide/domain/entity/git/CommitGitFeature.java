package fr.epita.assistants.myide.domain.entity.git;

import fr.epita.assistants.myide.domain.entity.Feature;
import fr.epita.assistants.myide.domain.entity.Mandatory;
import fr.epita.assistants.myide.domain.entity.Project;
import fr.epita.assistants.myide.utils.Logger;
import org.eclipse.jgit.api.CommitCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.NoFilepatternException;
import org.eclipse.jgit.errors.RepositoryNotFoundException;
import org.eclipse.jgit.lib.PersonIdent;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class CommitGitFeature implements Feature {

    public CommitGitFeature(){}

    @Override
    public ExecutionReport execute(Project project, Object... params) {
            File repoDir = project.getRootNode().getPath().toFile();

            try (Git git = Git.open(repoDir)){

                CommitCommand commitGit = git.commit();

                PersonIdent author;
                try
                {
                    author = new PersonIdent(String.valueOf(params[1]),"autopush@epita.fr");
                    commitGit.setMessage(String.valueOf(params[0]))
                            .setAuthor(author)
                            .call();

                    Logger.log("Commit done by " + author.getName() + "\nMessage:\n" + params[0]);
                }
                catch (Exception e )
                {
                    commitGit.setMessage(String.valueOf(params[0]))
                            .call();
                    Logger.log("Commit done \nMessage:\n" + params[0]);
                }

            } catch (RepositoryNotFoundException e) {
                Logger.logError("Le dépôt n'a pas été trouvé au chemin spécifié.");
                return () -> false;
            } catch (IOException e) {
                Logger.logError("Une erreur d'I/O est survenue.");
                return () -> false;
            } catch (NoFilepatternException e) {
                throw new RuntimeException(e);
            } catch (GitAPIException e) {
                Logger.logError("Une erreur Git est survenue dans la commande Commit.");
                return () -> false;
            }
        return () -> true;
    }


    @Override
    public Type type() {
        return Mandatory.Features.Git.COMMIT;
    }
}
