import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminResetPasswordDto } from './dto/admin-reset-password.dto';
import { AdminForgotPasswordDto } from './dto/admin-forgot-password.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('add')
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  @Post('login')
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: AdminForgotPasswordDto) {
    return this.adminService.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-code')
  async verifyCode(@Body() { email, code }: { email: string; code: string }) {
    return this.adminService.verifyToken(email, code);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: AdminResetPasswordDto) {
    return this.adminService.resetPassword(resetPasswordDto);
  }
}
