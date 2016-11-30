function (doc) {
  if (doc.doc_type === 'contact') {
    /* key is username is currently phone number */
    emit(doc.email, {_id: doc._id});
  }
}
