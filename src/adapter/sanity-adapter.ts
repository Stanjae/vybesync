import { Adapter, AdapterUser, AdapterSession, VerificationToken } from "@auth/core/adapters";
import { client } from "@/sanity/client";
import { nanoid } from "nanoid";



export const SanityAdapter: Adapter = {
    async createUser(user) {
      const newName = user?.name?.replaceAll(" ", "_")?.trim();
      console.log("llona: ",newName);
      const newUser = { _id: `${user.id}`,  _type: "user", ...user,  name:newName };
      const newdoc = {...newUser, fullname:user.name, name:newName};
      await client.create(newdoc);
      return newUser as AdapterUser;
    },
    async getUser(id) {
      return client.fetch("*[_type == 'user' && _id == $id][0]", { id });
    },
    async getUserByEmail(email) {
      return client.fetch("*[_type == 'user' && email == $email][0]", { email });
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = await client.fetch(
        "*[_type == 'account' && provider == $provider && providerAccountId == $providerAccountId][0]{userId->}",
        { provider, providerAccountId }
      );
      return account?.userId;
    },
    async updateUser(user) {
      await client.patch(user.id).set(user).commit();
      return user as AdapterUser;
    },
    async deleteUser(id) {
      await client.delete(id);
    },
    async linkAccount(account) {
      const newId = `account.${nanoid()}`;
      const newAccount = { _id: newId, _type: "account", ...account };
      await client.create(newAccount);
      await client.patch(newId).set({ userId: { _type: "reference", _ref: account.userId } }).commit();
      return newAccount;
    },
    async unlinkAccount({ provider, providerAccountId }) {
      const account = await client.fetch(
        "*[_type == 'account' && provider == $provider && providerAccountId == $providerAccountId][0]",
        { provider, providerAccountId }
      );
      if (account) await client.delete(account._id);
    },
    async createSession(session) {
      const newId = `session.${nanoid()}`;
      const newSession = { _id: newId, _type: "session", ...session };
      await client.create(newSession);
      await client.patch(newId).set({ userId: { _type: "reference", _ref: session.userId } }).commit();
      return newSession as AdapterSession;
    },
    async getSessionAndUser(sessionToken) {
      return client.fetch(
        "*[_type == 'session' && sessionToken == $sessionToken][0]{..., user->}",
        { sessionToken }
      );
    },
    async updateSession(session) {
      await client.patch(session.sessionToken).set(session).commit();
      return session as AdapterSession;
    },
    async deleteSession(sessionToken) {
      await client.delete(sessionToken);
    },
    async createVerificationToken(verificationToken) {
      const newToken = { _id: `token.${nanoid()}`, _type: "verificationToken", ...verificationToken };
      await client.create(newToken);
      return newToken as VerificationToken;
    },
    async useVerificationToken({ identifier, token }) {
      const verificationToken = await client.fetch(
        `*[_type == 'verificationToken' && identifier == "${identifier}" && token == "${token}"][0]`
      );
      if (verificationToken) await client.delete(verificationToken._id);
      return verificationToken;
    }
  };