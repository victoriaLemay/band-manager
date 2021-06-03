module.exports = class ArtistRepo {

    constructor(sequelize, ArtistModel) {
        this.sequelize = sequelize;
        this.artistModel = ArtistModel;
    }

    async createNewArtist(name) {
        return await this.artistModel.create({ name: name });
    }

}