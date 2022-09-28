interface IRoleWeight {
  ownerWeight: number
  guardianWeight: number
  assetsOpWeight: number
}
export class Weight {
  getMasterKeyWeight(): IRoleWeight {
    return {
      ownerWeight: 60,
      guardianWeight: 0,
      assetsOpWeight: 100,
    }
  }

  getPolicyWeight(): IRoleWeight {
    return {
      ownerWeight: 40,
      guardianWeight: 0,
      assetsOpWeight: 0,
    }
  }

  getRegisterEmailWeight(): IRoleWeight {
    return {
      ownerWeight: 60,
      guardianWeight: 60,
      assetsOpWeight: 0,
    }
  }

  getSelfGuardianlWeight(): IRoleWeight {
    return {
      ownerWeight: 50,
      guardianWeight: 50,
      assetsOpWeight: 0,
    }
  }

  getOneGuardianWeight(): IRoleWeight {
    return {
      ownerWeight: 0,
      guardianWeight: 50,
      assetsOpWeight: 0,
    }
  }

  getMoreGuardianWeight(): IRoleWeight {
    return {
      ownerWeight: 0,
      guardianWeight: 40,
      assetsOpWeight: 0,
    }
  }
}
